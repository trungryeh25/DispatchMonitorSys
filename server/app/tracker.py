from deep_sort_realtime.deepsort_tracker import DeepSort

tracker = DeepSort(max_age=30, n_init=3, max_iou_distance=0.7)

def update_tracks(detections, frame):
    """
    Update tracker với các detections mới.

    Args:
        detections (list): List dạng [ ( [x, y, w, h], conf, class_id ) ]
        frame (ndarray): Frame ảnh gốc

    Returns:
        list: List track object đã được xác nhận
    """
    tracks = tracker.update_tracks(detections, frame=frame)
    return tracks
