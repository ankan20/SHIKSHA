'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const StudentPage = () => {
  const [behaviorData, setBehaviorData] = useState<any[]>([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  let { teacherName } = useParams();

  // Decode the teacherName to handle spaces and special characters
  teacherName = decodeURIComponent(teacherName as string);
  console.log(teacherName);

  useEffect(() => {
    const fetchStudentData = async () => {
      const username = JSON.parse(localStorage.getItem('user') || '{}').username;

      try {
        const res = await fetch('/api/get-weekly-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ studentUsername: username, teacherUsername: teacherName }),
        });

        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await res.json();
        console.log(data);

        setBehaviorData(Array.isArray(data.behaviorData) ? data.behaviorData : [data.behaviorData]);
        setAttendancePercentage(data.attendancePercentage);
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [teacherName]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen  text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 mt-40">Behaviour and Attendance for teacher  {teacherName}</h1>

      <div className="bg-gray-800 shadow-lg rounded-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-300 p-4 border-b border-gray-700">Behaviour Data</h2>
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              {['Date', 'Hand Raising', 'Reading', 'Turn Around', 'Looking Forward', 'Writing', 'Using Phone', 'Sleeping'].map((heading) => (
                <th key={heading} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {behaviorData.map((data: any, index) => (
              <tr key={index} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {new Date(data.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{data.hand_raising}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{data.reading}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{data.turn_around}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{data.looking_forward}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{data.writing}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{data.using_phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{data.sleeping}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-300 p-4 border-b border-gray-700">Attendance Percentage</h2>
        <p className="p-4 text-lg text-gray-100">{attendancePercentage.toFixed(2)}%</p>
      </div>
    </div>
  );
};

export default StudentPage;
