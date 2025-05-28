from ultralytics import YOLO
import cv2
import os
from collections import defaultdict
from deepface import DeepFace

def process_image(img_path, registered_data_folder, output_dir):
    # Load the YOLO model
    model = YOLO('face_detection_model.pt')

    # Set thresholds
    y_thresh = 200
    x_thresh = 100

    # Load the image
    img = cv2.imread(img_path)

    # Run inference
    results = model(img, conf=0.75)

    # Extract bounding boxes and confidences
    boxes = results[0].boxes.xyxy.cpu().numpy()  # x1, y1, x2, y2

    # Initialize lists to store center points and bounding box info
    centers = []
    bbox_info = []

    # Store the image crops
    crops = []
    image_counter = 2252040

    for box in boxes:
        x1, y1, x2, y2 = map(int, box[:4])

        # Calculate center point
        center_x = (x1 + x2) // 2
        center_y = (y1 + y2) // 2
        centers.append((center_x, center_y))
        bbox_info.append((x1, y1, x2, y2))

    # Group points by y-axis value within the threshold
    grouped_y_points = defaultdict(list)
    for x, y in centers:
        found = False
        for key in list(grouped_y_points.keys()):
            if abs(y - key) <= y_thresh:
                grouped_y_points[key].append((x, y))
                found = True
                break
        if not found:
            grouped_y_points[y].append((x, y))

    for key, points in grouped_y_points.items():
        points_sorted = sorted(points, key=lambda p: p[0])

        for point in points_sorted:
            center_x, center_y = point
            for bbox in bbox_info:
                bx1, by1, bx2, by2 = bbox
                if bx1 <= center_x <= bx2 and by1 <= center_y <= by2:
                    cropped_img = img[by1:by2, bx1:bx2]
                    output_path = os.path.join(output_dir, f'{image_counter}.png')
                    cv2.imwrite(output_path, cropped_img)
                    crops.append(output_path)
                    image_counter += 1
                    break

    # Match detected faces with registered faces
    registered_faces = [f for f in os.listdir(registered_data_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp'))]
    results = []

    for student_face in crops:
        match_found = False
        student_face_name = os.path.splitext(os.path.basename(student_face))[0]

        for registered_face in registered_faces:
            registered_face_path = os.path.join(registered_data_folder, registered_face)
            try:
                result = DeepFace.verify(student_face, registered_face_path, enforce_detection=False)

                if result['verified']:
                    match_found = True
                    registered_name = os.path.splitext(registered_face)[0]
                    if student_face_name != registered_name:
                        results.append({"status": "Mismatch", "current_seat": student_face_name, "actual_seat": registered_name})
                    break
            except Exception:
                continue

        if not match_found:
            results.append({"status": "Intruder", "student": student_face_name})

    return {"message": "Processing complete", "results": results}
