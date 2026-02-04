from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import numpy as np
import cv2
import base64
from datetime import datetime
from PIL import Image
import io
from model_arch import SwinUNet  # استدعاء الموديل من الملف الأول

app = FastAPI(title="Pneumothorax Segmentation API")

# السماح بالاتصال من أي مكان (عشان لو هتربطه بـ Frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
model = None
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

@app.on_event("startup")
async def load_model():
    global model
    try:
        # تهيئة الموديل
        model = SwinUNet(num_classes=1, pretrained=False)
        
        # تحميل الأوزان (تأكد إن اسم الملف صح)
        checkpoint = torch.load("best_swin_unet.pth", map_location=device)
        
        # التعامل سواء كان الملف checkpoint كامل أو state_dict بس
        if isinstance(checkpoint, dict) and 'model_state_dict' in checkpoint:
            model.load_state_dict(checkpoint['model_state_dict'])
        else:
            model.load_state_dict(checkpoint)
            
        model.to(device)
        model.eval()
        print(f"✅ Model loaded successfully on {device}")
    except Exception as e:
        print(f"❌ Error loading model: {e}")

def mask_to_base64(mask_np):
    """تحويل الماسك (Numpy Array) لصورة Base64 شفافة (RGBA) لتظهر باللون الأحمر"""
    h, w = mask_np.shape
    # إنشاء صورة بربع قنوات (BGRA) - النتيجة كلها أصفار (شفافة بالكامل)
    img_bgra = np.zeros((h, w, 4), dtype=np.uint8)
    
    # تحديد الأماكن اللي فيها ماسك (القيمة 1)
    # القناة 2 (الأحمر) = 255
    img_bgra[mask_np == 1, 2] = 255 
    # القناة 3 (الشفافية Alpha) = 127 (نصف شفافة)
    img_bgra[mask_np == 1, 3] = 127
    
    _, buffer = cv2.imencode('.png', img_bgra)
    return "data:image/png;base64," + base64.b64encode(buffer).decode("utf-8")

@app.post("/predict")
async def predict_pneumothorax(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    start_time = datetime.now()

    # 1. قراءة الصورة
    contents = await file.read()
    image_pil = Image.open(io.BytesIO(contents)).convert("L") # تحويل لـ Grayscale
    original_size = image_pil.size # (W, H)
    
    # 2. Preprocessing (زي الـ Notebook Cell 75)
    image_np = np.array(image_pil)
    image_resized = cv2.resize(image_np, (224, 224))
    image_tensor = torch.from_numpy(image_resized).float() / 255.0
    image_tensor = image_tensor.unsqueeze(0).unsqueeze(0).to(device) # (1, 1, 224, 224)

    # 3. Prediction
    with torch.no_grad():
        output = model(image_tensor)
        prob_map = torch.sigmoid(output)
        max_prob = prob_map.max().item()
        
        # --- Dynamic Thresholding ---
        # لو الثقة عالية استخدم 0.5
        # لو الثقة متوسطة (0.25 - 0.5) نزل الـ Threshold حسب أعلى قيمة
        # لو أقل من كدا اعتبرها صورة سليمة
        threshold = 0.5
        if max_prob < 0.5:
            if max_prob > 0.25:
                threshold = max_prob * 0.9 # خد اعلى 10% من اللى الموديل شاكك فيه
                print(f"⚠️ Low confidence ({max_prob:.4f}). Dynamic threshold: {threshold:.4f}")
            else:
                threshold = 1.0 # مستحيل يتحقق -> ماسك فاضي
                print(f"✅ No confident detection ({max_prob:.4f}).")
        else:
             print(f"🚀 High confidence ({max_prob:.4f}). Standard threshold.")
        # ----------------------------

        pred_mask = (prob_map > threshold).float()

    # 4. Post-processing & Analysis
    pred_mask_np = pred_mask.squeeze().cpu().numpy().astype(np.uint8)
    
    # --- Morphological Cleanup to remove noise ---
    kernel = np.ones((5,5), np.uint8)
    pred_mask_np = cv2.morphologyEx(pred_mask_np, cv2.MORPH_OPEN, kernel) # Remove small noise
    pred_mask_np = cv2.morphologyEx(pred_mask_np, cv2.MORPH_CLOSE, kernel) # Close gaps
    # ---------------------------------------------
    
    # حساب نسبة المنطقة المصابة
    affected_pixels = np.count_nonzero(pred_mask_np)
    total_pixels = pred_mask_np.size
    affected_area_pct = (affected_pixels / total_pixels) * 100
    
    # --- SANITY CHECK: Suppress Large Noise ---
    if affected_area_pct > 40.0:
        print(f"⚠️ Mask covers {affected_area_pct:.1f}% of image. Suspected noise. Suppressing.")
        pred_mask_np[:] = 0
        affected_area_pct = 0.0
    # ------------------------------------------
    
    # تحديد شدة الإصابة بناءً على النسبة
    severity = "None"
    if affected_area_pct > 0:
        if affected_area_pct < 10: severity = "Mild"
        elif affected_area_pct < 30: severity = "Moderate"
        else: severity = "Severe"

    # إعادة حجم الماسك للحجم الأصلي عشان يرجع في الـ JSON
    final_mask = cv2.resize(pred_mask_np, original_size, interpolation=cv2.INTER_NEAREST)
    
    # تجهيز النصوص الطبية
    findings = []
    if affected_area_pct > 0:
        findings.append("Pneumothorax identified.")
        findings.append(f"Approximately {affected_area_pct:.1f}% lung field involved.")
        findings.append("Immediate clinical correlation recommended.")
    else:
        findings.append("No Pneumothorax detected.")
        findings.append("Lung fields appear clear.")

    # حساب وقت التنفيذ
    execution_time = (datetime.now() - start_time).total_seconds()

    # 5. بناء الـ JSON response النهائي
    response = {
        "hasPneumothorax": bool(affected_area_pct > 0),
        "confidence": float(prob_map.max().item() * 100) if affected_area_pct > 0 else float((1 - prob_map.max().item()) * 100),
        "affectedArea": round(affected_area_pct, 1),
        "severity": severity,
        "location": "Detected Region", # يحتاج موديل Detection لتحديد المكان بدقة (Upper/Lower)
        "segmentationMap": mask_to_base64(final_mask),
        "maskOverlay": mask_to_base64(final_mask), # في الفرونت إند هيحطها فوق الصورة الأصلية
        "detectionTime": f"{execution_time:.3f}s",
        "timestamp": datetime.now().isoformat(),
        "patientId": "Unknown", # بييجي عادة من الـ Request Header أو الـ Frontend
        "metrics": {
            "precision": 0.0, # لا يمكن حسابه بدقة بدون Ground Truth للصورة الجديدة
            "recall": 0.0,
            "iou": 0.0,
            "diceScore": 0.0
        },
        "findings": findings
    }
    
    return response