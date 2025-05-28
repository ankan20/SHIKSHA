import cv2
from ultralytics import YOLO
from moviepy.editor import VideoFileClip

# Define progress reporting points
PROGRESS_LIST = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
model_path='projector_best.pt'
def process_video(video_path: str) -> dict:
    # Load the YOLOv8 model
    model = YOLO(model_path)

    # Initialize video capture from the file
    cap = cv2.VideoCapture(video_path)

    # Get the width and height of the video frames
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Calculate the total number of frames in the video
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))

    # Variables to track time and state
    state = "OFF"
    brightness_threshold = 250
    frame_counter = 0
    processed_frames = 0
    on_frames = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Process every fps/2th frame
        if (frame_counter % (fps // 2)) != 0:
            frame_counter += 1
            continue

        # Use YOLO model to detect objects
        results = model(frame, verbose=False)

        # Process detected objects
        if len(results[0].boxes) > 0:
            box = results[0].boxes[0].xyxy[0].cpu().numpy()  # Get bounding box coordinates
            x1, y1, x2, y2 = map(int, box)

            # Extract the ROI based on the detected bounding box
            roi = frame[y1:y2, x1:x2]

            # Convert ROI to grayscale and apply Gaussian Blur
            gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
            blurred_roi = cv2.GaussianBlur(gray_roi, (5, 5), 0)

            # Find the brightest spot in the ROI
            min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(blurred_roi)
            brightest_spot_intensity = max_val

            # Adjust max_loc to be relative to the full frame
            max_loc = (max_loc[0] + x1, max_loc[1] + y1)

            # Determine the projector state based on brightness
            if state == "OFF" and brightest_spot_intensity > brightness_threshold:
                state = "ON"
            elif state == "ON":
                on_frames += 1
                if brightest_spot_intensity <= brightness_threshold:
                    state = "OFF"

        # Update counters
        processed_frames += 1
        frame_counter += 1

        # Print progress every 10%
        progress = (processed_frames / (total_frames // (fps // 2))) * 100
        if int(progress) in PROGRESS_LIST:
            print(f"Processed {int(progress)}% of the video.")
            PROGRESS_LIST.remove(int(progress))

    # Finalize and release resources
    cap.release()

    # Calculate and print the duration
    clip = VideoFileClip(video_path)
    total_on_time = (on_frames / processed_frames) * clip.duration
    total_off_time = clip.duration - total_on_time

    # Prepare JSON data
    result = {
        "video_duration": clip.duration,
        "total_on_time": total_on_time,
        "total_off_time": total_off_time
    }

    print(f"Video Duration: {clip.duration:.2f} seconds")
    print(f"Total time the projector was ON: {total_on_time:.2f} seconds ({total_on_time/60:.2f} minutes)")
    print(f"Total time the projector was OFF: {total_off_time:.2f} seconds ({total_off_time/60:.2f} minutes)")

    return result
