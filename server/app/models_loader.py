import torch
from m_utils import load_resnet
import pathlib
import sys

# Patch PosixPath -> WindowsPath
if sys.platform == 'win32':
    pathlib.PosixPath = pathlib.WindowsPath

# Load YOLO model
yolo = torch.hub.load('ultralytics/yolov5', 'custom', path='app/models/best.pt', source='github')

# Load ResNet models
dish_model = load_resnet('app/models/resnet_dish.pt')
tray_model = load_resnet('app/models/resnet_tray.pt')
