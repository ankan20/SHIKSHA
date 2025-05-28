"use client"
import React, { useState } from 'react';
import axios from 'axios';
import FireDetectionAlert from './FireAlert';

const FireDetection: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [fireDetected, setFireDetected] = useState(false);
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setData(null);
    setAlertVisible(false);

    if (!selectedFile) {
      setError('Please select a video file.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('video', selectedFile);

    try {
      const response = await axios.post('http://localhost:5001/api/detect-fire', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const result = response.data;
      console.log(result)
      setData(result);
      setFireDetected(data.fire_detected);

      // Check if fire is detected and show alert
      if (result.detections.length > 0) {
        setAlertVisible(true);
      }
    } catch (err) {
      setError('Error processing the video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[78vh] mt-40 text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Fire Detection Alarm System</h1>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-300 border border-gray-600 rounded-lg p-3 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out hover:bg-gray-700 active:bg-gray-600"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          {loading ? 'Processing...' : 'Upload Video'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

      {alertVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Fire Detected!</h2>
            <p className="mt-2">Fire has been detected in the video. Please check the results for more details.</p>
            <button
              onClick={() => setAlertVisible(false)}
              className="mt-4 px-4 py-2 bg-red-800 rounded-md hover:bg-red-900 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* {data && (
        <div className="max-w-lg mx-auto mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">Detection Results</h2>
          <table className="w-full bg-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="py-3 px-4 bg-gray-600 border-b border-gray-500 text-left">Frame</th>
                <th className="py-3 px-4 bg-gray-600 border-b border-gray-500 text-left">Bounding Box</th>
                <th className="py-3 px-4 bg-gray-600 border-b border-gray-500 text-left">Label</th>
              </tr>
            </thead>
            <tbody>
              {data.detections.map((detection: any, index: number) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-500">{detection.frame}</td>
                  <td className="py-2 px-4 border-b border-gray-500">
                    [{detection.bounding_box.join(', ')}]
                  </td>
                  <td className="py-2 px-4 border-b border-gray-500">{detection.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )} */}
    <FireDetectionAlert fireDetected={fireDetected} />
    {
       data && <p className='text-center mt-4'>No fire detected</p>
    }
    </div>
  );
};

export default FireDetection;
