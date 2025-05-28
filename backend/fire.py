import cv2
import os
from ultralytics import YOLO
from flask import jsonify

# Load YOLOv8 model for detection
model = YOLO('fire.pt')

def detect_fire_in_video(video_path: str):
    # Initialize variables to store detection results
    detections = []
    fire_detected_once = False  # Flag to indicate if fire was detected in any frame

    # Open video input
    cap = cv2.VideoCapture(video_path)

    # Process each frame
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Run model on the frame
        results = model(frame)  # Run the model

        # Check if results contain any detections
        if results:
            for result in results:
                # Check if any boxes were detected
                if result.boxes.cls.size(0) > 0:
                    # Get detected class names
                    detected_classes = result.names

                    # Collect detection information
                    for i, box in enumerate(result.boxes.xyxy):
                        x1, y1, x2, y2 = map(int, box.tolist())
                        cls = int(result.boxes.cls[i].item())
                        label = detected_classes[cls]

                        # Append detection information to results
                        if label == 'Fire Detected':
                            fire_detected_once = True  # Set flag if fire is detected
                            detections.append({
                                'frame': int(cap.get(cv2.CAP_PROP_POS_FRAMES)),
                                'bounding_box': [x1, y1, x2, y2],
                                'label': label
                            })

    cap.release()

    # Return detections and fire detected flag as JSON
    return {'detections': detections, 'fire_detected': fire_detected_once}
