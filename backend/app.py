# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# import os
# import pandas as pd
# import attendance  # Import the behavior module
# import behavior
# from noice import detect_noise
# import moviepy.editor as mp


# app = Flask(__name__)
# CORS(app)
# CORS(app, origins=["http://localhost:3000"])


# # Define folders
# UPLOAD_FOLDER = 'uploads'
# AUDIO_UPLOAD_FOLDER = 'uploads/audio'
# REGISTERED_FACES_FOLDER = os.path.abspath('../frontend/public/uploads')
# CSV_FILE_PATH = 'attendance_result.csv'  # Path to save CSV file
# face_model_path='face_detection_model.pt'
# behavior_model_path='behaviour_model.pt'


# # Ensure directories exist
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# os.makedirs('outputvideo',exist_ok=True)
# os.makedirs(AUDIO_UPLOAD_FOLDER, exist_ok=True)

# @app.route('/api/upload-video', methods=['POST'])
# def upload_video():
#     if 'video' not in request.files:
#         return jsonify({'error': 'No video file provided.'}), 400
    
#     video = request.files['video']
#     if video.filename == '':
#         return jsonify({'error': 'No selected file.'}), 400
    
#     video_path = os.path.join(UPLOAD_FOLDER, video.filename)
#     video.save(video_path)
   
#     try:
#         # Process the video using the behavior module
#         response_data = attendance.process_attendance(video_path, REGISTERED_FACES_FOLDER)
        
#         # Save the CSV file
#         df = pd.DataFrame(response_data['attendance'])
#         df.to_csv(CSV_FILE_PATH, index=False)
        
#         # Send video and JSON response
#         return jsonify(response_data), 200

#     except Exception as e:
#         app.logger.error(f"Error processing video: {e}")
#         return jsonify({'error': 'Failed to process the video.'}), 500

# @app.route('/api/behavior-detection', methods=['POST'])
# def behavior_detection():
#     if 'video' not in request.files:
#         return jsonify({'error': 'No video file provided.'}), 400
    
#     video = request.files['video']
#     if video.filename == '':
#         return jsonify({'error': 'No selected file.'}), 400
    
#     video_path = os.path.join(UPLOAD_FOLDER, video.filename)
#     video.save(video_path)

#     try:
#         # Process the video to get behavior data
#         response_data = behavior.process_video(video_path, REGISTERED_FACES_FOLDER,face_model_path, behavior_model_path)

#         # Only send the video and behavior data in the response
#         return jsonify(response_data), 200

#     except Exception as e:
#         app.logger.error(f"Error processing video for behavior detection: {e}")
#         return jsonify({'error': 'Failed to process the video.'}), 500


# @app.route('/api/detect-noise', methods=['POST'])
# def detect_noise_route():
#     # Check if the video file is part of the request
#     if 'video' not in request.files:
#         return jsonify({'error': 'No video file provided.'}), 400
    
#     video = request.files['video']
    
#     # Check if the video file is not empty
#     if video.filename == '':
#         return jsonify({'error': 'No selected file.'}), 400
    
#     # Save the video file
#     video_path = os.path.join(UPLOAD_FOLDER, video.filename)
#     video.save(video_path)
    
#     # Extract audio from the video using MoviePy
#     audio_filename = os.path.splitext(video.filename)[0] + '.wav'
#     audio_path = os.path.join(AUDIO_UPLOAD_FOLDER, audio_filename)

#     try:
#         # Load the video file and extract audio
#         video_clip = mp.VideoFileClip(video_path)
#         video_clip.audio.write_audiofile(audio_path)
        
#         # Use the detect_noise function from noise.py on the extracted audio
#         result = detect_noise(audio_path)

#     finally:
#         # Clean up: remove both the video and audio files after processing
#         if os.path.exists(video_path):
#             os.remove(video_path)
#         if os.path.exists(audio_path):
#             os.remove(audio_path)

#     # Return the JSON result from detect_noise
#     return result



# if __name__ == '__main__':
#     app.run(debug=True, port=5001)
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import pandas as pd
import attendance  # Import the behavior module
import behavior
from noice import detect_noise
import moviepy.editor as mp
import tempfile
from projector import process_video
import time
import logging
from fire import detect_fire_in_video
import threading
import requests
from face_processing import process_image

# Set up logging
logging.basicConfig(level=logging.DEBUG)


app = Flask(__name__)
CORS(app)
# Define folders
TEMP_DIR = 'tmp'
UPLOAD_FOLDER = 'uploads'
AUDIO_UPLOAD_FOLDER = 'uploads/audio'
REGISTERED_FACES_FOLDER = os.path.abspath('../frontend/public/uploads')
CSV_FILE_PATH = 'attendance_result.csv'  # Path to save CSV file
face_model_path = 'face_detection_model.pt'
behavior_model_path = 'behaviour_model.pt'
seat_output_dir = '/content/students_with_seat_matrix'
seat_registered_data_folder = os.path.abspath('../frontend/public/seat_registered')

os.makedirs(seat_output_dir, exist_ok=True)

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs('outputvideo', exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(AUDIO_UPLOAD_FOLDER, exist_ok=True)
os.makedirs('video_frames', exist_ok=True)

ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def delete_file(file_path, delay=1):
    """Delete a file after a delay."""
    time.sleep(delay)
    if os.path.exists(file_path):
        os.remove(file_path)


@app.route('/api/upload-video', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided.'}), 400
    
    video = request.files['video']
    if video.filename == '':
        return jsonify({'error': 'No selected file.'}), 400
    
    video_path = os.path.join(UPLOAD_FOLDER, video.filename)
    video.save(video_path)
   
    try:
        # Process the video using the behavior module
        response_data = attendance.process_attendance(video_path, REGISTERED_FACES_FOLDER)
        
        # Save the CSV file
        df = pd.DataFrame(response_data['attendance'])
        df.to_csv(CSV_FILE_PATH, index=False)
        
        # Send video and JSON response
        return jsonify(response_data), 200

    except Exception as e:
        app.logger.error(f"Error processing video: {e}")
        return jsonify({'error': 'Failed to process the video.'}), 500

@app.route('/api/behavior-detection', methods=['POST'])
def behavior_detection():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided.'}), 400
    
    video = request.files['video']
    if video.filename == '':
        return jsonify({'error': 'No selected file.'}), 400
    
    video_path = os.path.join(UPLOAD_FOLDER, video.filename)
    video.save(video_path)

    try:
        # Process the video to get behavior data
        response_data = behavior.process_video(video_path, REGISTERED_FACES_FOLDER, face_model_path, behavior_model_path)

        # Only send the video and behavior data in the response
        return jsonify(response_data), 200

    except Exception as e:
        app.logger.error(f"Error processing video for behavior detection: {e}")
        return jsonify({'error': 'Failed to process the video.'}), 500

@app.route('/api/noice-ditecttion', methods=['POST'])
def detect_noise_route():
    # Check if the video file is part of the request
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided.'}), 400
    
    video = request.files['video']
    
    # Check if the video file is not empty
    if video.filename == '':
        return jsonify({'error': 'No selected file.'}), 400
    
    # Save the video file
    video_path = os.path.join(UPLOAD_FOLDER, video.filename)
    video.save(video_path)
    
    # Extract audio from the video using MoviePy
    audio_filename = os.path.splitext(video.filename)[0] + '.wav'
    audio_path = os.path.join(AUDIO_UPLOAD_FOLDER, audio_filename)
    
    try:
        # Load the video file and extract audio
        with mp.VideoFileClip(video_path) as video_clip:
            video_clip.audio.write_audiofile(audio_path)
        
        # Check if audio file exists
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found after extraction: {audio_path}")

        # Use the detect_noise function from noice.py on the extracted audio
        result = detect_noise(audio_path, video_path)
        
        return jsonify(result)
    except Exception as e:
        logging.error("Error in detect_noise_route: %s", str(e))
        return jsonify({'error': str(e)}), 500
    finally:
        # Introduce a delay before deleting files
        time.sleep(1)
        
        # Delete the audio file
        if os.path.exists(audio_path):
            os.remove(audio_path)
        
        # Optionally delete the video file if provided
        if os.path.exists(video_path):
            os.remove(video_path)



@app.route('/api/projector-ditecttion', methods=['POST'])
def uprojector_ditecttion():
    # Check if a file is part of the request
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    # Check if the file is selected
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Validate the file
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    # Save the file to a temporary location
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_file:
        file_path = temp_file.name
        file.save(file_path)

    try:
        # Process the video and get results
        result = process_video(file_path)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/detect-fire', methods=['POST'])
def detect_fire_route():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided.'}), 400
    
    video = request.files['video']

    # Check if the video file is not empty
    if video.filename == '':
        return jsonify({'error': 'No selected file.'}), 400

    # Save the video file temporarily
    video_path = os.path.join(TEMP_DIR, video.filename)
    video.save(video_path)

    try:
        # Call the fire detection function
        result = detect_fire_in_video(video_path)

        # Start a thread to delete the file after 1 second
        threading.Thread(target=delete_file, args=(video_path,)).start()

        return result
    except Exception as e:
        # Clean up file if an error occurs
        if os.path.exists(video_path):
            os.remove(video_path)
        return jsonify({'error': str(e)}), 500
    

@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    prompt = "User: " + data["prompt"] + "\nAI:"  # Format the prompt
    return jsonify({"error": "Failed to generate response"}), 200


@app.route('/seat-check', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the uploaded image
    img_path = os.path.join(seat_output_dir, file.filename)
    file.save(img_path)

    # Process the image and get results
    results = process_image(img_path, seat_registered_data_folder, seat_output_dir)

    return jsonify(results), 200


if __name__ == '__main__':
    app.run(debug=True, port=5001)
