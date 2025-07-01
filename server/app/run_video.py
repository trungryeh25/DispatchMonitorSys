from video_processor import process_video

if __name__ == "__main__":
    # Đường dẫn video input 
    input_path = "video_kitchenArea.mp4"

    # Đường dẫn video output (video annotated)
    output_path = "output/output_annotated.mp4"

    # Đường dẫn file log JSON
    log_path = "output/log.json"

    process_video(input_path, output_path, log_path)
