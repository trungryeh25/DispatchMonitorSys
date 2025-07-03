import cv2
import json
from tracker import update_tracks
from models_loader import yolo
import os

def process_video(input_path, output_path, log_path):
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        print(f"[✘] Cannot open video: {input_path}")
        return

    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (w, h))

    # if the log file already exists, delete it to avoid overwriting.
    if os.path.exists(log_path):
        os.remove(log_path)

    log = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = yolo(frame)
        detections = []

        for *box, conf, cls in results.xyxy[0]:
            x1, y1, x2, y2 = map(int, box)
            detections.append(([x1, y1, x2 - x1, y2 - y1], float(conf), int(cls)))

        tracks = update_tracks(detections, frame)

        for track in tracks:
            if not track.is_confirmed():
                continue

            track_id = track.track_id
            x1, y1, x2, y2 = map(int, track.to_ltrb())
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, f'ID:{track_id}', (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

            log.append({
                'frame': int(cap.get(cv2.CAP_PROP_POS_FRAMES)),
                'track_id': track_id,
                'bbox': [x1, y1, x2, y2],
            })

        out.write(frame)

        # log data in real time on a per-frame basis
        with open(log_path, 'w') as f:
            json.dump(log, f, indent=4)

    cap.release()
    out.release()

    print(f"[✔] Video saved: {output_path}")
    print(f"[✔] Log saved: {log_path}")
