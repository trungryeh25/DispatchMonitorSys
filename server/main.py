import torch
from flask import Flask, request, jsonify, send_file
import cv2
import numpy as np
import json
import pathlib
import sys
import uuid
import os
from app.m_utils import load_resnet, classify_crop
from app.feedback import (
    save_feedback,
    get_all_feedback,
    update_datasets_from_feedback,
    retrain_classifier,
    retrain_yolo,
)
from flask_cors import CORS

# Fix Path cho Windows
if sys.platform == 'win32':
    pathlib.PosixPath = pathlib.WindowsPath

app = Flask(__name__)
CORS(app)

# Load YOLOv5
yolo = torch.hub.load('ultralytics/yolov5', 'custom', path='app/models/best.pt', source='github')
# Load ResNet
dish_model = load_resnet('app/models/resnet_dish.pt')
tray_model = load_resnet('app/models/resnet_tray.pt')

# Global label map
label_map = ["empty", "not_empty", "kakigori"]

def draw_results_on_image(img, objects):
    for obj in objects:
        x1, y1, x2, y2 = obj["box"]
        cls_name = obj["type"]
        label = obj["class_label"]
        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(img, f"{cls_name}:{label}", (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    return img

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['image']
    nparr = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results = yolo(img)
    objects = []

    for idx, (*box, conf, cls) in enumerate(results.xyxy[0], start=1):
        x1, y1, x2, y2 = map(int, box)
        cls_name = yolo.names[int(cls)]
        crop = img[y1:y2, x1:x2]

        if cls_name == "dish":
            pred_class = classify_crop(crop, dish_model)
        elif cls_name == "tray":
            pred_class = classify_crop(crop, tray_model)
        else:
            pred_class = -1

        label = label_map[pred_class] if pred_class != -1 else "unknown"

        objects.append({
            "index": idx,
            "type": cls_name,
            "class_label": label,
            "box": [x1, y1, x2, y2],
            "confidence": float(conf)
        })

    # drawing bounding box
    img = draw_results_on_image(img, objects)
    if not os.path.exists("static"):
        os.makedirs("static")
    
    # create unique file
    unique_id = uuid.uuid4().hex
    output_path = f"static/predicted_{unique_id}.jpg"
    cv2.imwrite(output_path, img)

    return jsonify({
        "results": objects,
        "image_url": f"/{output_path}"
    })


@app.route('/feedback', methods=['POST'])
def feedback():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No feedback data provided"}), 400
    save_feedback(data)
    return jsonify({"message": "Feedback saved successfully!", "data": data})

@app.route('/feedback', methods=['GET'])
def get_feedback():
    data = get_all_feedback()
    return jsonify({"feedback": data})

@app.route('/retrain', methods=['POST'])
def retrain():
    update_datasets_from_feedback()
    retrain_classifier()
    retrain_yolo()
    return jsonify({"message": "Datasets updated and models retrained successfully!"})

@app.route('/get_log', methods=['GET'])
def get_log():
    try:
        with open("output/log.json", "r") as f:
            log_data = json.load(f)
        return jsonify(log_data)
    except Exception as e:
        return jsonify({"message": f"Error reading log: {e}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
