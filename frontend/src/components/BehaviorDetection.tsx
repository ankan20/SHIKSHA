// "use client";
// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter, useParams } from 'next/navigation';

// interface Behavior {
//   looking_forward?: number;
//   reading?: number;
//   turn_around?: number;
//   sleeping?: number;
//   using_phone?: number;
//   writing?: number;
//   hand_raising?: number;
// }

// interface BehaviorData {
//   [student: string]: Behavior;
// }

// const BehaviorDetection: React.FC = () => {
//   const [videoFile, setVideoFile] = useState<File | null>(null);
//   const [behaviorData, setBehaviorData] = useState<BehaviorData | null>(null);
//   const [percentageData, setPercentageData] = useState<BehaviorData | null>(null); // New state for percentage data
//   const [duration, setDuration] = useState<number | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
  
//   const router = useRouter();
//   const params = useParams();
//   const teacherUsername = params?.teachername ? decodeURIComponent(params.teachername as string) : ""; // Get the dynamic 'name' parameter from the URL

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setVideoFile(file);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!videoFile || !teacherUsername) {
//       setError('Please select a video file and ensure the teacher username is available.');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('video', videoFile);

//     try {
//       const response = await axios.post('http://localhost:5001/api/behavior-detection', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       // Handle response
//       const { behavior_data, duration } = response.data;
//       setBehaviorData(behavior_data);
//       setDuration(duration);

//       // Convert behavior data to percentages
//       const modifiedBehaviorData = calculateBehaviorPercentages(behavior_data);
//       setPercentageData(modifiedBehaviorData); // Update percentage data
//       await axios.post('/api/save-behavior-data', { behavior_data: modifiedBehaviorData, teacherUsername });

//     } catch (error) {
//       setError('Failed to process the video.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateBehaviorPercentages = (data: BehaviorData) => {
//     const result: BehaviorData = {};

//     for (const [student, behaviors] of Object.entries(data)) {
//       const total = Object.values(behaviors).reduce((acc, value) => acc + (value || 0), 0);
      
//       if (total > 0) {
//         result[student] = {
//           looking_forward: ((behaviors.looking_forward || 0) / total) * 100,
//           reading: ((behaviors.reading || 0) / total) * 100,
//           turn_around: ((behaviors.turn_around || 0) / total) * 100,
//           sleeping: ((behaviors.sleeping || 0) / total) * 100,
//           using_phone: ((behaviors.using_phone || 0) / total) * 100,
//           writing: ((behaviors.writing || 0) / total) * 100,
//           hand_raising: ((behaviors.hand_raising || 0) / total) * 100,
//         };
//       } else {
//         result[student] = behaviors; // Keep original if total is zero to avoid division by zero
//       }
//     }

//     return result;
//   };

//   const formatDuration = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${minutes}m ${secs}s`;
//   };

//   const downloadCSV = () => {
//     if (!percentageData) return;

//     const headers = [
//       'Student',
//       'Looking Forward (%)',
//       'Reading (%)',
//       'Turning Around (%)',
//       'Sleeping (%)',
//       'Using Phone (%)',
//       'Writing (%)',
//       'Hand Raising (%)',
//     ];

//     const rows = Object.entries(percentageData).map(([student, behaviors]) => [
//       student,
//       behaviors.looking_forward?.toFixed(2) || '0.00',
//       behaviors.reading?.toFixed(2) || '0.00',
//       behaviors.turn_around?.toFixed(2) || '0.00',
//       behaviors.sleeping?.toFixed(2) || '0.00',
//       behaviors.using_phone?.toFixed(2) || '0.00',
//       behaviors.writing?.toFixed(2) || '0.00',
//       behaviors.hand_raising?.toFixed(2) || '0.00',
//     ]);

//     const csvContent = [
//       headers.join(','),
//       ...rows.map(row => row.join(',')),
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'behavior_data.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="min-h-[78vh] mt-40  text-white">
//       <header className=" py-4">
//         <div className="container mx-auto text-center">
//           <h1 className="text-3xl font-bold">Behaviour Detection</h1>
//         </div>
//       </header>

//       <main className="py-8">
//         <div className="container mx-auto px-4">
//           {/* Video Upload Section */}
//           <section className="mb-8">
//             <div className="bg-gray-700 p-4 rounded-lg shadow-lg">
//               <h2 className="text-2xl font-semibold mb-4">Upload Video</h2>
//               <input
//                 type="file"
//                 accept="video/*"
//                 onChange={handleFileChange}
//                 className="mb-4"
//               />
//               <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 disabled:opacity-50"
//               >
//                 {loading ? 'Processing...' : 'Submit Video'}
//               </button>
//               {error && <p className="text-red-500 mt-2">{error}</p>}
//             </div>
//           </section>

//           {/* Behavior Data Section */}
//           {percentageData && Object.keys(percentageData).length > 0 && (
//             <section>
//               <div className="bg-gray-700 p-4 rounded-lg shadow-lg">
//                 <h2 className="text-2xl font-semibold mb-4">Behavior Data</h2>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-600">
//                     <thead>
//                       <tr>
//                         <th className="py-2 px-4 text-left text-gray-400">Student</th>
//                         <th className="py-2 px-4 text-left text-gray-400">Looking Forward (%)</th>
//                         <th className="py-2 px-4 text-left text-gray-400">Reading (%)</th>
//                         <th className="py-2 px-4 text-left text-gray-400">Turning Around (%)</th>
//                         <th className="py-2 px-4 text-left text-gray-400">Sleeping (%)</th>
//                         <th className="py-2 px-4 text-left text-gray-400">Using Phone (%)</th>
//                         <th className="py-2 px-4 text-left text-gray-400">Writing (%)</th>
//                         <th className="py-2 px-4 text-left text-gray-400">Hand Raising (%)</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-600">
//                       {Object.entries(percentageData).map(([student, behaviors]) => (
//                         <tr key={student}>
//                           <td className="py-2 px-4">{student}</td>
//                           <td className="py-2 px-4">{behaviors.looking_forward?.toFixed(2) || '0.00'}</td>
//                           <td className="py-2 px-4">{behaviors.reading?.toFixed(2) || '0.00'}</td>
//                           <td className="py-2 px-4">{behaviors.turn_around?.toFixed(2) || '0.00'}</td>
//                           <td className="py-2 px-4">{behaviors.sleeping?.toFixed(2) || '0.00'}</td>
//                           <td className="py-2 px-4">{behaviors.using_phone?.toFixed(2) || '0.00'}</td>
//                           <td className="py-2 px-4">{behaviors.writing?.toFixed(2) || '0.00'}</td>
//                           <td className="py-2 px-4">{behaviors.hand_raising?.toFixed(2) || '0.00'}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 {duration && (
//                   <p className="mt-4">Video Duration: {formatDuration(duration)}</p>
//                 )}
//                 <button
//                   onClick={downloadCSV}
//                   className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
//                 >
//                   Download CSV
//                 </button>
//               </div>
//             </section>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default BehaviorDetection;


"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';

interface Behavior {
  looking_forward?: number;
  reading?: number;
  turn_around?: number;
  sleeping?: number;
  using_phone?: number;
  writing?: number;
  hand_raising?: number;
}

interface BehaviorData {
  [student: string]: Behavior;
}

const BehaviorDetection: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null); // New state for video preview
  const [behaviorData, setBehaviorData] = useState<BehaviorData | null>(null);
  const [percentageData, setPercentageData] = useState<BehaviorData | null>(null); // New state for percentage data
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const params = useParams();
  const teacherUsername = params?.teachername ? decodeURIComponent(params.teachername as string) : ""; // Get the dynamic 'name' parameter from the URL

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file)); // Create a preview URL for the video
    }
  };

  const handleSubmit = async () => {
    if (!videoFile || !teacherUsername) {
      setError('Please select a video file and ensure the teacher username is available.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      const response = await axios.post('http://localhost:5001/api/behavior-detection', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Handle response
      const { behavior_data, duration } = response.data;
      setBehaviorData(behavior_data);
      setDuration(duration);

      // Convert behavior data to percentages
      const modifiedBehaviorData = calculateBehaviorPercentages(behavior_data);
      setPercentageData(modifiedBehaviorData); // Update percentage data
      await axios.post('/api/save-behavior-data', { behavior_data: modifiedBehaviorData, teacherUsername });

    } catch (error) {
      setError('Failed to process the video.');
    } finally {
      setLoading(false);
    }
  };

  const calculateBehaviorPercentages = (data: BehaviorData) => {
    const result: BehaviorData = {};

    for (const [student, behaviors] of Object.entries(data)) {
      const total = Object.values(behaviors).reduce((acc, value) => acc + (value || 0), 0);
      
      if (total > 0) {
        result[student] = {
          looking_forward: ((behaviors.looking_forward || 0) / total) * 100,
          reading: ((behaviors.reading || 0) / total) * 100,
          turn_around: ((behaviors.turn_around || 0) / total) * 100,
          sleeping: ((behaviors.sleeping || 0) / total) * 100,
          using_phone: ((behaviors.using_phone || 0) / total) * 100,
          writing: ((behaviors.writing || 0) / total) * 100,
          hand_raising: ((behaviors.hand_raising || 0) / total) * 100,
        };
      } else {
        result[student] = behaviors; // Keep original if total is zero to avoid division by zero
      }
    }

    return result;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}m ${secs}s`;
  };

  const downloadCSV = () => {
    if (!percentageData) return;

    const headers = [
      'Student',
      'Looking Forward (%)',
      'Reading (%)',
      'Turning Around (%)',
      'Sleeping (%)',
      'Using Phone (%)',
      'Writing (%)',
      'Hand Raising (%)',
    ];

    const rows = Object.entries(percentageData).map(([student, behaviors]) => [
      student,
      behaviors.looking_forward?.toFixed(2) || '0.00',
      behaviors.reading?.toFixed(2) || '0.00',
      behaviors.turn_around?.toFixed(2) || '0.00',
      behaviors.sleeping?.toFixed(2) || '0.00',
      behaviors.using_phone?.toFixed(2) || '0.00',
      behaviors.writing?.toFixed(2) || '0.00',
      behaviors.hand_raising?.toFixed(2) || '0.00',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'behavior_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-[78vh] mt-40 text-white">
      <header className="py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">Behaviour Detection</h1>
        </div>
      </header>

      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Video Upload Section */}
          <section className="mb-8">
            <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Upload Video</h2>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                 className="block w-full text-sm text-gray-300 border border-gray-600 rounded-lg p-3 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out hover:bg-gray-700 active:bg-gray-600"
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 mt-5 text-white px-4 py-2 rounded-lg hover:bg-blue-500 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Submit Video'}
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
              {/* Video Preview */}
              {videoPreview && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-2">Video Preview</h3>
                  <video
                    src={videoPreview}
                    controls
                    className="w-full max-w-md border rounded-lg"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Behavior Data Section */}
          {percentageData && Object.keys(percentageData).length > 0 && (
            <section>
              <div className="bg-gray-700 p-4 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Behavior Data</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-600">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 text-left text-gray-400">Student</th>
                        <th className="py-2 px-4 text-left text-gray-400">Looking Forward (%)</th>
                        <th className="py-2 px-4 text-left text-gray-400">Reading (%)</th>
                        <th className="py-2 px-4 text-left text-gray-400">Turning Around (%)</th>
                        <th className="py-2 px-4 text-left text-gray-400">Sleeping (%)</th>
                        <th className="py-2 px-4 text-left text-gray-400">Using Phone (%)</th>
                        <th className="py-2 px-4 text-left text-gray-400">Writing (%)</th>
                        <th className="py-2 px-4 text-left text-gray-400">Hand Raising (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                      {Object.entries(percentageData).map(([student, behaviors]) => (
                        <tr key={student}>
                          <td className="py-2 px-4">{student}</td>
                          <td className="py-2 px-4">{behaviors.looking_forward?.toFixed(2) || '0.00'}</td>
                          <td className="py-2 px-4">{behaviors.reading?.toFixed(2) || '0.00'}</td>
                          <td className="py-2 px-4">{behaviors.turn_around?.toFixed(2) || '0.00'}</td>
                          <td className="py-2 px-4">{behaviors.sleeping?.toFixed(2) || '0.00'}</td>
                          <td className="py-2 px-4">{behaviors.using_phone?.toFixed(2) || '0.00'}</td>
                          <td className="py-2 px-4">{behaviors.writing?.toFixed(2) || '0.00'}</td>
                          <td className="py-2 px-4">{behaviors.hand_raising?.toFixed(2) || '0.00'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={downloadCSV}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
                >
                  Download CSV
                </button>
                {duration !== null && (
                  <p className="mt-4">Video Duration: {formatDuration(duration)}</p>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default BehaviorDetection;
