import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision.models import swin_t, Swin_T_Weights

# --- الجزء الخاص بالـ Decoder (من Notebook Cell 62) ---
class DoubleConv(nn.Module):
    def __init__(self, in_ch, out_ch):
        super(DoubleConv, self).__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(in_ch, out_ch, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_ch),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_ch, out_ch, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_ch),
            nn.ReLU(inplace=True),
        )

    def forward(self, x):
        return self.conv(x)

class UpBlock(nn.Module):
    def __init__(self, in_ch, out_ch):
        super(UpBlock, self).__init__()
        self.up = nn.Upsample(scale_factor=2, mode='bilinear', align_corners=False)
        self.conv = DoubleConv(in_ch, out_ch)

    def forward(self, x, skip):
        x = self.up(x)
        if x.size()[-2:] != skip.size()[-2:]:
            diffY = skip.size(2) - x.size(2)
            diffX = skip.size(3) - x.size(3)
            x = F.pad(x, [diffX // 2, diffX - diffX // 2, diffY // 2, diffY - diffY // 2])
        x = torch.cat([skip, x], dim=1)
        return self.conv(x)

class UNetDecoder(nn.Module):
    def __init__(self, encoder_channels, out_classes=1):
        super(UNetDecoder, self).__init__()
        c1, c2, c3, c4 = encoder_channels
        self.up1 = UpBlock(c4 + c3, 384)
        self.up2 = UpBlock(384 + c2, 192)
        self.up3 = UpBlock(192 + c1, 96)
        self.up4 = nn.Sequential(
            nn.Upsample(scale_factor=2, mode='bilinear', align_corners=True),
            nn.Conv2d(96, 48, kernel_size=3, padding=1),
            nn.BatchNorm2d(48),
            nn.ReLU(inplace=True)
        )
        self.up5 = nn.Sequential(
            nn.Upsample(scale_factor=2, mode='bilinear', align_corners=True),
            nn.Conv2d(48, 24, kernel_size=3, padding=1),
            nn.BatchNorm2d(24),
            nn.ReLU(inplace=True)
        )
        self.final_conv = nn.Conv2d(24, out_classes, kernel_size=1)

    def forward(self, features):
        f1, f2, f3, f4 = features
        x = self.up1(f4, f3)
        x = self.up2(x, f2)
        x = self.up3(x, f1)
        x = self.up4(x)
        x = self.up5(x)
        mask = self.final_conv(x)
        return mask

# --- الجزء الخاص بالـ Encoder (من Notebook Cell 58) ---
class SwinTinyGrayEncoder(nn.Module):
    def __init__(self, pretrained=True):
        super().__init__()
        self.gray2rgb = nn.Sequential(
            nn.Conv2d(1, 3, kernel_size=3, padding=1),
            nn.ReLU(inplace=True)
        )
        # Note: weights=None here to avoid downloading inside API, usually we load state_dict later
        self.model = swin_t(weights=None) 
        self.encoder = self.model.features
        self.out_channels = [96, 192, 384, 768]

    def forward(self, x):
        x = self.gray2rgb(x)
        features = []
        x = self.encoder[0](x)
        x = self.encoder[1](x)
        features.append(x)
        x = self.encoder[2](x)
        x = self.encoder[3](x)
        features.append(x)
        x = self.encoder[4](x)
        x = self.encoder[5](x)
        features.append(x)
        x = self.encoder[6](x)
        x = self.encoder[7](x)
        features.append(x)
        
        features_fixed = []
        for feat in features:
            if feat.dim() == 4:
                if feat.shape[-1] in [96, 192, 384, 768]:
                    feat = feat.permute(0, 3, 1, 2).contiguous()
            features_fixed.append(feat)
        return features_fixed

# --- الموديل الكامل (من Notebook Cell 64) ---
class SwinUNet(nn.Module):
    def __init__(self, num_classes=1, pretrained=True):
        super().__init__()
        self.encoder = SwinTinyGrayEncoder(pretrained=pretrained)
        self.decoder = UNetDecoder(encoder_channels=self.encoder.out_channels, out_classes=num_classes)

    def forward(self, x):
        features = self.encoder(x)
        mask = self.decoder(features)
        return mask