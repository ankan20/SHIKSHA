// import { useState } from 'react';

// export default function UploadPage() {
//   const [file, setFile] = useState(null);
//   const [results, setResults] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string |null>(null);

//   // Handle file selection
//   const handleFileChange = (e:any) => {
//     setFile(e.target.files[0]);
//   };

//   // Handle form submission
//   const handleSubmit = async (e:any) => {
//     e.preventDefault();
//     if (!file) {
//       setError('No file selected');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await fetch('http://localhost:5001/api/projector-ditecttion', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json() as any;
//       setResults(data);
//     } catch (error :any) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Upload a Video for Processing</h1>
      
//       <form onSubmit={handleSubmit} className="mb-6">
//         <input
//           type="file"
//           accept="video/mp4"
//           onChange={handleFileChange}
//           className="mb-4"
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Upload and Process
//         </button>
//       </form>

//       {loading && <p className="text-gray-500">Processing...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {results && (
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead>
//             <tr className="bg-gray-100 border-b">
//               <th className="py-2 px-4 text-left text-gray-700">Metric</th>
//               <th className="py-2 px-4 text-left text-gray-700">Value</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr className="border-b">
//               <td className="py-2 px-4 text-black">Video Duration</td>
//               <td className="py-2 px-4 text-black">{results.video_duration.toFixed(2)} seconds</td>
//             </tr>
//             <tr className="border-b">
//               <td className="py-2 px-4 text-black">Total ON Time</td>
//               <td className="py-2 px-4 text-black">{results.total_on_time.toFixed(2)} seconds</td>
//             </tr>
//             <tr className="border-b">
//               <td className="py-2 px-4 text-black">Total OFF Time</td>
//               <td className="py-2 px-4 text-black">{results.total_off_time.toFixed(2)} seconds</td>
//             </tr>
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
"use client"

import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState<any |null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!file) {
      setError('No file selected');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5001/api/projector-ditecttion', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json() as any;
      setResults(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen  text-white p-6">
      <div className="w-full max-w-3xl bg-gray-800 shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Upload a Video to See Resource Usage</h1>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="file"
            accept="video/mp4"
            onChange={handleFileChange}
            className="file:bg-blue-500 file:text-white file:border-none file:py-2 file:px-4 file:rounded-md cursor-pointer mb-4 text-gray-300"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors duration-200"
          >
            {loading ? 'Processing...' : 'Upload and Process'}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {results && (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-6 text-left text-gray-700 font-medium">Metric</th>
                  <th className="py-3 px-6 text-left text-gray-700 font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-6 text-black">Video Duration</td>
                  <td className="py-3 px-6 text-black">{results.video_duration.toFixed(2)} seconds</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-6 text-black">Total ON Time</td>
                  <td className="py-3 px-6 text-black">{results.total_on_time.toFixed(2)} seconds</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-6 text-black">Total OFF Time</td>
                  <td className="py-3 px-6 text-black">{results.total_off_time.toFixed(2)} seconds</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
