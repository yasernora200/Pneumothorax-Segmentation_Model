# Chest X-Ray Images with Pneumothorax Masks for Semantic Segmentation

## Project Overview
This project is a **deep learning system** for **semantic segmentation** of **pneumothorax** (collapsed lung) in chest X-ray images.  
The system is designed to automatically analyze medical images, preprocess noisy and imbalanced data, and accurately segment pneumothorax regions using an **EfficientNet-B4 U-Net architecture**.

The pipeline covers the full workflow starting from **data analysis and preprocessing**, passing through **data augmentation and balancing**, and ending with **model training and evaluation**.

---

## Key Features
- Semantic segmentation of pneumothorax from chest X-ray images
- Extensive data analysis and quality inspection
- Automatic mask binarization and normalization
- Advanced data augmentation strategies
- Class imbalance handling using weighted sampling
- Custom EfficientNet-B4 encoder for grayscale images
- U-Net style decoder with skip connections
- Combined **BCE + Focal Dice Loss**
- Early stopping and learning rate scheduling

---

## Technologies Used
- Python
- PyTorch
- segmentation-models-pytorch
- OpenCV
- NumPy & Pandas
- Matplotlib
- torchvision
- Backend: Flask , Api
- Frontend: React.js , TailwindCSS

---

## Dataset
- **Chest X-Ray Images with Pneumothorax Masks**  
- Dataset from Kaggle provided by **vbookshelf**, derived from pneumothorax chest X-ray data and prepared for segmentation tasks.
- Kaggle Link: https://www.kaggle.com/datasets/vbookshelf/pneumothorax-chest-xray-images-and-masks


### Data Description
- **Number of Images:** 12,047 chest X-ray images  
- **Number of Masks:** 12,047 corresponding binary pneumothorax segmentation masks  
- **Image Size:** 1024 × 1024  
- **Image Format:** PNG  
- **Mask Type:** Binary segmentation masks  
  - `0` → Background / No pneumothorax  
  - `1` → Pneumothorax region  

---

## Project Structure
```text
FINAL_DEEP_PROJECT/
├── backend/
│   ├── __pycache__/
│   ├── best_model.pth
│   ├── DeepLearning_ProjectFF.ipynb
│   ├── main.py
│   └── model_arch.py
│
├── frontend/
│
└── README.md
```
## Data Preprocessing
The preprocessing pipeline includes:
- Checking for missing and corrupted images
- Detecting blank images and empty masks
- Mask normalization and binarization
- Dataset balance analysis
- Lesion size and connected components analysis
- Brightness, contrast, and noise inspection

All masks are normalized to clean binary values `{0, 255}` to ensure stable training.

## Data Augmentation
Different augmentation strategies are applied depending on the class:

### Positive Samples (With Pneumothorax)
- Vertical flipping
- Random brightness and contrast adjustment
- Gaussian noise
- CLAHE (Contrast Limited Adaptive Histogram Equalization)
- Random affine transformations

### Negative Samples (Normal)
- Light brightness and contrast changes
- Mild Gaussian noise
- Occasional flipping

This strategy helps improve generalization while preserving medical realism.
 

## Dataset Balancing
To handle class imbalance, the project uses:
- **WeightedRandomSampler** during training
- Optional undersampling strategies
- Separate augmentation pipelines for positive and negative samples

This ensures the model is exposed to pneumothorax cases more effectively during training.

---

## Model Architecture
### Encoder
- **EfficientNet-B4**
- Modified to accept **grayscale (1-channel) images**
- Pretrained on ImageNet
- Extracts multi-scale feature maps for skip connections

### Decoder
- U-Net style decoder
- Bilinear upsampling
- Skip connections from encoder layers
- Final 1×1 convolution for segmentation output

## Loss Function
The training objective combines:
- **Binary Cross Entropy Loss**
- **Focal Dice Loss**

This combination improves performance on small lesion regions and imbalanced segmentation masks.

## Training Strategy
- Optimizer: **Adam**
- Learning rate scheduling: ReduceLROnPlateau
- Early stopping based on validation loss
- Best model checkpoint saving

## Evaluation
The model is evaluated on a held-out test set using segmentation loss metrics.  
Visual inspection of predicted masks and overlay results is also performed to assess qualitative performance.

---

## How to Run

### 1. Environment Setup
Make sure you have **Python 3.8+** installed on your system.
Install the required dependencies:
```bash
pip install -r requirements.txt
```

### 2. Prepare the Dataset
Download the SIIM-ACR Pneumothorax Segmentation Dataset
Convert DICOM images to PNG format
Ensure that each image has a corresponding binary mask
Recommended directory structure:
```bash
data/
├── png_images/
└── png_masks/
```

### 3. Run the Project Notebook
All preprocessing, data augmentation, model training, evaluation, and visualization are implemented within a single Jupyter Notebook.

Open the notebook using VS Code:
```bash
notebooks/DeepLearning_ProjectFF.ipynb
```
* Run all cells sequentially from top to bottom to:
- Clean and preprocess the dataset
- Apply data augmentation
- Train the EfficientNet-B4 U-Net segmentation model
- Evaluate the model using Dice Score and IoU
- Visualize segmentation results

### 4. Inference on New Images

To run inference on new chest X-ray images:

Place the images in the specified inference folder (as defined in the notebook)

Load the trained model weights:
```bash
best_model.pth
```
---
