import logging
import os
import cv2
import pandas as pd
from deepface import DeepFace

# Set up logging
logging.basicConfig(level=logging.INFO)

# Define paths
output_frames_folder = 'video_frames/'  # Folder to save extracted frames

# Helper function to check if a file is an image
def is_image_file(file_name):
    return file_name.lower().endswith(('.png', '.jpg', '.jpeg'))

# Create a directory for extracted frames if it doesn't exist
os.makedirs(output_frames_folder, exist_ok=True)

def extract_frames(video_path, frame_interval=30):
    video_capture = cv2.VideoCapture(video_path)
    if not video_capture.isOpened():
        logging.error(f"Error opening video file: {video_path}")
        return
    
    frame_count = 0
    extracted_frame_count = 0

    while True:
        ret, frame = video_capture.read()
        if not ret:
            break

        if frame_count % frame_interval == 0:
            frame_filename = os.path.join(output_frames_folder, f'frame_{extracted_frame_count}.jpg')
            cv2.imwrite(frame_filename, frame)
            extracted_frame_count += 1

        frame_count += 1

    video_capture.release()
    logging.info(f"Extracted {extracted_frame_count} frames from the video.")

def process_attendance(input_video_path, registered_faces_folder):
    extract_frames(input_video_path)

    # Get the list of registered student images
    registered_students = [f for f in os.listdir(registered_faces_folder) if is_image_file(f)]

    # Initialize a list to store attendance results
    attendance = []

    # Create a set to track which students have been marked present
    students_marked_present = set()

    # Process each extracted frame
    for frame_name in os.listdir(output_frames_folder):
        frame_path = os.path.join(output_frames_folder, frame_name)

        try:
            # Perform face recognition using DeepFace
            dfs = DeepFace.find(img_path=frame_path, db_path=registered_faces_folder, model_name='VGG-Face', enforce_detection=False)

            # Initialize variables to track the best match
            best_match_student = None
            lowest_distance = float('inf')

            # Iterate through the list of DataFrames returned by DeepFace.find()
            for df in dfs:
                if not df.empty:
                    for _, row in df.iterrows():
                        registered_name = os.path.splitext(os.path.basename(row['identity']))[0]
                        registered_name = registered_name.split('_')[0]

                        if registered_name in students_marked_present:
                            continue

                        if row['distance'] < lowest_distance:
                            lowest_distance = row['distance']
                            best_match_student = registered_name

            # Mark the best match as present
            if best_match_student and lowest_distance < 0.5:
                if best_match_student not in students_marked_present:
                    students_marked_present.add(best_match_student)
                    attendance.append({"Student Name": best_match_student, "Attendance Status": "Present"})

        except Exception as e:
            logging.error(f"Error processing frame {frame_name}: {e}")

    # Add remaining registered students who were not marked present
    for registered_image_name in registered_students:
        student_name = os.path.splitext(registered_image_name)[0]
        student_name = student_name.split('_')[0]
        if student_name not in students_marked_present:
            attendance.append({"Student Name": student_name, "Attendance Status": "Absent"})

    # Convert the attendance list to a DataFrame
    df = pd.DataFrame(attendance)

    # Remove duplicates based on 'Student Name' column
    df.drop_duplicates(subset='Student Name', keep='first', inplace=True)

    # Convert back to list of dictionaries
    unique_attendance_data = df.to_dict(orient='records')

    # Clean up temporary files
    for filename in os.listdir(output_frames_folder):
        file_path = os.path.join(output_frames_folder, filename)
        os.remove(file_path)
    # os.rmdir(output_frames_folder)

    # Remove the input video file
    os.remove(input_video_path)

    return {
        'attendance': unique_attendance_data
    }
