import numpy as np
import scipy.io.wavfile as wav
import os

def detect_noise(audio_path, video_path=None):
    # Check if the audio file exists
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    # Load the audio file
    sample_rate, data = wav.read(audio_path)

    # Convert to mono if the audio is stereo (2D array)
    if len(data.shape) > 1:
        data = np.mean(data, axis=1)

    # Parameters
    frame_size = 1024
    hop_size = 512
    time_threshold = 1.5  # seconds
    frames_per_second = sample_rate / hop_size
    frames_per_time_threshold = int(time_threshold * frames_per_second)

    # Initialize arrays to store feature values
    zcr_values = []

    # Calculate ZCR for each frame
    for i in range(0, len(data) - frame_size, hop_size):
        frame = data[i:i + frame_size]
        zcr = np.mean(np.abs(np.diff(np.sign(frame)))) / 2
        zcr_values.append(zcr)

    # Convert lists to numpy arrays
    zcr_values = np.array(zcr_values)

    # Initialize durations
    time_below_threshold = 0
    time_above_threshold = 0

    # Analyze ZCR values
    i = 0
    while i < len(zcr_values):
        if zcr_values[i] < 0.1:
            count = 0
            # Check if the ZCR stays below 0.1 for the next frames_per_time_threshold frames
            while i + count < len(zcr_values) and zcr_values[i + count] < 0.1:
                count += 1
                if count >= frames_per_time_threshold:
                    # If condition is met for at least 1 second, count the duration
                    time_below_threshold += count * hop_size / sample_rate
                    i += count
                    break
            else:
                # If the condition is not met, move to the next frame
                i += count
        else:
            count = 0
            # Check if the ZCR stays above 0.1
            while i + count < len(zcr_values) and zcr_values[i + count] >= 0.1:
                count += 1
                time_above_threshold += count * hop_size / sample_rate
                i += count

    # Calculate the total duration in seconds
    total_duration = len(data) / sample_rate
    time_above_threshold = total_duration - time_below_threshold
    
    # Prepare the JSON response
    result = {
        "total_duration": round(total_duration, 2),
        "noise_duration": round(time_below_threshold, 2),
        "voice_duration": round(time_above_threshold, 2)
    }

    # Delete the audio file
    if os.path.exists(audio_path):
        os.remove(audio_path)
    
    # Optionally delete the video file if provided
    if video_path and os.path.exists(video_path):
        os.remove(video_path)

    return result
