import json
import os
import shutil
import cv2
import datetime
import uuid

# Đường dẫn file JSON feedback
FEEDBACK_FILE = "feedback/feedback.json"

# Dataset mới từ feedback cho classifier
CLASSIFIER_DATASET_DIR = "feedback/updated_dataset_resnet"

# Dataset mới từ feedback cho YOLO (nếu có dùng)
YOLO_DATASET_DIR = "feedback/updated_dataset_yolo"


def save_feedback(feedback_data):
    """
    Lưu feedback từ user vào file JSON.
    """
    if not os.path.exists(FEEDBACK_FILE):
        os.makedirs(os.path.dirname(FEEDBACK_FILE), exist_ok=True)
        with open(FEEDBACK_FILE, 'w') as f:
            json.dump([], f)

    with open(FEEDBACK_FILE, 'r') as f:
        data = json.load(f)
        
    # Tự động thêm id và timestamp
    feedback_entry = {
        "id": str(uuid.uuid4()),
        "image_id": feedback_data.get("image_id", ""),
        "object_id": feedback_data.get("object_id", ""),
        "correct_label": feedback_data.get("correct_label", ""),
        # "timestamp": datetime.datetime.now().isoformat()
    }

    data.append(feedback_entry)

    with open(FEEDBACK_FILE, 'w') as f:
        json.dump(data, f, indent=4)

    print("[✔] Feedback saved!")


def get_all_feedback():
    """
    Lấy toàn bộ feedback đã lưu.
    """
    if not os.path.exists(FEEDBACK_FILE):
        return []
    with open(FEEDBACK_FILE, 'r') as f:
        return json.load(f)


def update_classifier_dataset(feedback):
    """
    Update dataset cho classifier dựa trên feedback: detect đúng nhưng classify sai.
    """
    img_path = feedback.get("image_path")
    box = feedback.get("detected_box")
    correct_label = feedback.get("correct_label")

    if not img_path or not box or not correct_label:
        print("[!] Missing information for classifier update.")
        return

    img = cv2.imread(img_path)
    x1, y1, x2, y2 = map(int, box)
    crop = img[y1:y2, x1:x2]

    label_dir = os.path.join(CLASSIFIER_DATASET_DIR, correct_label)
    os.makedirs(label_dir, exist_ok=True)

    filename = os.path.basename(img_path).replace(".jpg", f"_{correct_label}.jpg")
    save_path = os.path.join(label_dir, filename)
    cv2.imwrite(save_path, crop)

    print(f"[✔] Saved crop for classifier under label '{correct_label}' at {save_path}")


def update_yolo_dataset(feedback):
    """
    Update dataset cho YOLO nếu detect sai hoặc missing object.
    """
    img_path = feedback.get("image_path")
    correct_label = feedback.get("correct_label")

    if not img_path or not correct_label:
        print("[!] Missing information for YOLO update.")
        return

    label_dir = os.path.join(YOLO_DATASET_DIR, correct_label)
    os.makedirs(label_dir, exist_ok=True)

    dest_path = os.path.join(label_dir, os.path.basename(img_path))
    shutil.copy(img_path, dest_path)

    print(f"[✔] Copied image to YOLO dataset under label '{correct_label}' at {dest_path}")


def update_datasets_from_feedback():
    """
    Tổng hợp: update dataset classifier và YOLO dựa trên feedback.
    """
    feedback_list = get_all_feedback()

    if not feedback_list:
        print("[!] No feedback to process.")
        return

    for fb in feedback_list:
        feedback_type = fb.get("feedback_type", "classifier")

        if feedback_type == "classifier":
            update_classifier_dataset(fb)
        elif feedback_type == "yolo":
            update_yolo_dataset(fb)
        else:
            print(f"[!] Unknown feedback_type: {feedback_type}")

    print("[✔] All feedback processed and datasets updated!")


def retrain_classifier():
    """
    Mô phỏng retrain classifier.
    """
    print("[🚀] Start retraining classifier with updated dataset...")
    # subprocess.run(["python", "train_classifier.py", "--data", CLASSIFIER_DATASET_DIR], check=True)
    print("[✅] Retraining classifier completed!")


def retrain_yolo():
    """
    Mô phỏng retrain YOLO model.
    """
    print("[🚀] Start retraining YOLO model with updated dataset...")
    # subprocess.run(["python", "train_yolo.py", "--data", YOLO_DATASET_DIR], check=True)
    print("[✅] Retraining YOLO completed!")
