"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { FileUpload } from "@/components/ui/file-upload";
const AdminPage = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<
    Array<{ "Student Name": string; "Attendance Status": string }>
  >([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading status
  const router = useRouter();
  const params = useParams();
  const teacherUsername = params?.teachername ? decodeURIComponent(params.teachername as string) : "";
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile) {
      setMessage("Please select a video to upload.");
      return;
    }

    setIsLoading(true); // Set loading state to true

    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/upload-video",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        setAttendanceData(response.data.attendance);
        setMessage("Video uploaded successfully!");
        await axios.post("/api/mark-attendance", {
          teacherUsername,
          attendanceData: response.data.attendance,
        });
      } else {
        setMessage("Failed to process video.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Failed to upload video.");
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  const downloadCSV = async () => {
    if (attendanceData.length === 0) {
      return;
    }

    // Generate CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Student Name,Attendance Status\n"; // CSV header
    attendanceData.forEach((item) => {
      csvContent += `${item["Student Name"]},${item["Attendance Status"]}\n`;
    });

    // Create a download link for the CSV
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_result.csv");
    document.body.appendChild(link); // Required for the link to work in Firefox
    link.click();
    document.body.removeChild(link); // Remove the link after the download
  };

  return (
    <div className="min-h-screen p-8 flex justify-center items-center mt-8">
      {/* Flex container to align video upload and attendance section side by side */}
      <div className="flex flex-col md:flex-row justify-between w-full space-x-0 md:space-x-10">
        {/* Video Upload Section */}
        <div className="mt-16 flex-1">
          <h1 className="text-3xl font-bold text-white mb-6">
            Upload Video for Attendance Analysis
          </h1>
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 p-6 rounded-lg shadow-lg w-full"
          >
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Select Video:
              </label>
              <input
  type="file"
  accept="video/*"
  onChange={handleVideoChange}
  className="block w-full text-sm text-gray-300 border border-gray-600 rounded-lg p-3 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out hover:bg-gray-700 active:bg-gray-600"
/>

              
            </div>

            {videoUrl && (
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-2">
                  Video Preview:
                </label>
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-64 bg-gray-700 rounded"
                />
              </div>
            )}

            <button
              type="submit"
              className={`w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                isLoading
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Submit"}
            </button>

            {!isLoading && message==="Failed to upload video." && (
              <p className="mt-4 text-center text-red-400">{message}</p>
            )}
            {
              !isLoading && message ==="Video uploaded successfully!" && (
                <p className="mt-4 text-center text-green-400">{message}</p>
              )
            }
          </form>
        </div>

        {/* Attendance Data Section */}
        {attendanceData.length > 0 && (
          <div className="mt-16 flex-1 bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              Attendance Results
            </h2>
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Attendance Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {attendanceData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      {item["Student Name"]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {item["Attendance Status"]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={downloadCSV}
              className="mt-6 p-3 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Download CSV
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
