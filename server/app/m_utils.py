import torch
import torchvision.transforms as transforms
import cv2
import numpy as np
from torchvision import models
import torch.nn as nn

def load_resnet(path, num_classes=3):
    model = models.resnet18(weights=None)
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    model.load_state_dict(torch.load(path, map_location='cpu'))
    model.eval()
    return model

def classify_crop(img, model):
    transform = transforms.Compose([
        transforms.ToPILImage(),
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ])
    tensor = transform(img).unsqueeze(0)
    with torch.no_grad():
        outputs = model(tensor)
        _, pred = torch.max(outputs, 1)
    return pred.item()
