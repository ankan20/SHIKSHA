import os
import cv2
import logging
import json
from deepface import DeepFace
from ultralytics import YOLO  # Ensure you import your YOLO implementation
from typing import Dict, Any

# Function to calculate IoU (Intersection over Union)
def calculate_iou(boxA, boxB):
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])

    interArea = max(0, xB - xA) * max(0, yB - yA)
    boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])

    iou = interArea / float(boxAArea + boxBArea - interArea)
    return iou

# Main processing function
def process_video(video_path: str, registered_faces_folder: str, face_model_path: str, behavior_model_path: str) -> Dict[str, Any]:
    # Set up logging
    logging.basicConfig(level=logging.INFO)

    # Load YOLO models for face detection and behavior detection
    face_model = YOLO(face_model_path)
    behavior_model = YOLO(behavior_model_path)

    video_output_path = '/outputvideo/output_video.mp4'  # Path to save the output video
    

    # Helper function to check if a file is an image
    def is_image_file(file_name):
        return file_name.lower().endswith(('.png', '.jpg', '.jpeg'))

    # Get the list of registered student images
    registered_students = [f for f in os.listdir(registered_faces_folder) if is_image_file(f)]

    os.makedirs('/content/detected_faces/', exist_ok=True)

    # Open the video file
    cap = cv2.VideoCapture(video_path)

    # Get video properties
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    video_duration = total_frames / fps

    # Define the codec and create a VideoWriter object
    out = cv2.VideoWriter(video_output_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (frame_width, frame_height))

    frames_to_process = 3
    process_interval = 1 * fps

    previous_detections = []
    previous_behaviors = []
    behavior_durations = {}

    frame_count = 0
    processed_frames = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % process_interval < frames_to_process:
            processed_frames += 1

            face_results = face_model.predict(frame)
            best_matches = {}

            for idx, result in enumerate(face_results[0].boxes.data.tolist()):
                x1, y1, x2, y2, conf, cls = map(int, result[:6])
                center_x = int((x1 + x2) / 2)
                center_y = int((y1 + y2) / 2)

                detected_face = frame[y1:y2, x1:x2]
                cropped_face_path = f'/content/detected_faces/detected_face_{frame_count}_{idx}.jpg'
                cv2.imwrite(cropped_face_path, detected_face)

                try:
                    dfs = DeepFace.find(img_path=cropped_face_path, db_path=registered_faces_folder, model_name='GhostFaceNet', enforce_detection=False)

                    best_match_student = None
                    lowest_distance = float('inf')

                    for df in dfs:
                        if not df.empty:
                            for _, row in df.iterrows():
                                registered_name = os.path.splitext(os.path.basename(row['identity']))[0]

                                if row['distance'] < lowest_distance:
                                    lowest_distance = row['distance']
                                    best_match_student = registered_name.split('_')[0]

                    if best_match_student and lowest_distance < 0.5:
                        if best_match_student not in best_matches or lowest_distance < best_matches[best_match_student]['distance']:
                            best_matches[best_match_student] = {
                                'center_x': center_x,
                                'center_y': center_y,
                                'bbox': (x1, y1, x2, y2),
                                'distance': lowest_distance
                            }

                except Exception as e:
                    logging.error(f"Error processing face {idx} in frame {frame_count}: {e}")

            current_detections = [
                (data['center_x'], data['center_y'], student, data['bbox'])
                for student, data in best_matches.items()
            ]

            for student in best_matches:
                if student not in behavior_durations:
                    behavior_durations[student] = {}

            if not current_detections:
                current_detections = previous_detections

            added_names = []
            for prev_detection in previous_detections:
                prev_center_x, prev_center_y, prev_name, prev_bbox = prev_detection

                face_still_detected = False
                for curr_detection in current_detections:
                    curr_center_x, curr_center_y, curr_name, curr_bbox = curr_detection
                    if prev_name == curr_name:
                        face_still_detected = True
                        break

                if not face_still_detected:
                    current_detections.append(prev_detection)
                    added_names.append(prev_name)

            previous_detections = current_detections

            behavior_results = behavior_model.predict(frame)

            current_behaviors = []

            name_to_iou = {}

            for behavior in behavior_results[0].boxes.data.tolist():
                bx1, by1, bx2, by2, b_conf, b_cls = map(int, behavior[:6])
                behavior_label = behavior_model.names[b_cls]

                associated_name = None
                max_iou = 0

                for (_, _, name, (x1, y1, x2, y2)) in current_detections:
                    extended_x1 = x1 - int(0.3 * (x2 - x1))
                    extended_y1 = y1 - int(0.2 * (y2 - y1))
                    extended_x2 = x2 + int(0.3 * (x2 - x1))
                    extended_y2 = y2 + int(0.5 * (y2 - y1))

                    iou = calculate_iou((extended_x1, extended_y1, extended_x2, extended_y2), (bx1, by1, bx2, by2))

                    if iou > max_iou:
                        max_iou = iou
                        associated_name = name

                if associated_name:
                    if associated_name in name_to_iou:
                        if max_iou > name_to_iou[associated_name]['iou']:
                            name_to_iou[associated_name] = {
                                'iou': max_iou,
                                'behavior': (bx1, by1, bx2, by2, associated_name, behavior_label)
                            }
                    else:
                        name_to_iou[associated_name] = {
                            'iou': max_iou,
                            'behavior': (bx1, by1, bx2, by2, associated_name, behavior_label)
                        }

            for associated_name, data in name_to_iou.items():
                current_behaviors.append(data['behavior'])
                if associated_name in behavior_durations:
                    if data['behavior'][5] not in behavior_durations[associated_name]:
                        behavior_durations[associated_name][data['behavior'][5]] = 0
                    behavior_durations[associated_name][data['behavior'][5]] += (process_interval / fps) / frames_to_process

            previous_behaviors = current_behaviors

        for (bx1, by1, bx2, by2, associated_name, behavior_label) in previous_behaviors:
            cv2.rectangle(frame, (bx1, by1), (bx2, by2), (0, 255, 255), 2)
            cv2.putText(frame, associated_name, (bx1, by1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)
            text_size, _ = cv2.getTextSize(associated_name, cv2.FONT_HERSHEY_SIMPLEX, 0.9, 2)
            text_width = text_size[0]
            behavior_label_position = (bx1 + text_width + 10, by1 - 10)
            cv2.putText(frame, f' - {behavior_label}', behavior_label_position, cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 255), 2)

        out.write(frame)
        frame_count += 1

    cap.release()
    out.release()

    # Clean up temporary files
    for file in os.listdir('/content/detected_faces/'):
        os.remove(os.path.join('/content/detected_faces/', file))
    os.rmdir('/content/detected_faces/')

    return {
        "video_path": video_output_path,
        "duration": video_duration,
        "behavior_data": behavior_durations
    }



