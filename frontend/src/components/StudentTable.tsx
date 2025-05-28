// "use client";
// import React, {  useEffect, useState } from "react";
// import { BackgroundBeams } from "./ui/background-beams";
// import { useRouter } from "next/navigation";
// import { Boxes } from "./ui/background-boxes";
// import axios from "axios";

// // Define the interface for the student data
// interface Student {
//   username: string;
// }

// const StudentTable: React.FC = () => {
//   const router = useRouter();
//   const [students, setStudents] = useState<Student[] | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [teacherName,setTeacherName] = useState();
//   const [message,setMessage]=useState("");

//   useEffect(() => {
//     // Retrieve the teacher's username from local storage
//     const teacherData = JSON.parse(localStorage.getItem('user') || '{}');
//     const username = teacherData.username;
//     setTeacherName(username);
//     // Fetch student data from the backend
//     const fetchStudents = async () => {
//       try {
//         const response = await axios.post(`/api/teacher/get-all-students`, {
//           username,
//         });
//         setStudents(response.data.students);
//       } catch (error) {
//         console.error("Error fetching students:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//     if(students?.length==0){
//       console.log(students.length)
//       setMessage("No student available!")
//     }

//   }, []);

//   const handleCardClick = (studentName: string) => {
//     console.log(teacherName);
//     router.push(`/teacherinfo/${studentName}`);
//   };

//   if (loading) return <div className="text-center mt-40">Loading...</div>;

//   return (
//     <div className="min-h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
//       <div className="absolute  inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
//       <Boxes />
//       <div className="relative p-6  w-full mt-5">
//         <h1 className="text-3xl font-bold mb-6 text-center text-white">
//           All Student Information
//         </h1>
//         <div className="overflow-x-auto  shadow-md sm:rounded-lg z-20 relative">
//           <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
//             <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//               <tr>
//                 <th scope="col" className="py-3 px-6">
//                   Student Name
//                 </th>
//                 <th scope="col" className="py-3 px-6">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {students && students.map((student) => (
//                 <tr
//                   key={student.username}
//                   className="bg-white border-b dark:bg-zinc-900 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
//                   onClick={() => handleCardClick(student.username)}
//                 >
//                   <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">
//                     {student.username}
//                   </td>
//                   <td className="py-4 px-6 text-blue-500 underline">
//                     Click here to see report
//                   </td>
//                 </tr>
//               ))}

//             </tbody>
//           </table>
//           {
//             <p className="text-red-200 mt-5 text-center">{message}</p>
//           }
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentTable;
"use client";
import React, { useEffect, useState } from "react";
import { BackgroundBeams } from "./ui/background-beams";
import { useParams, useRouter } from "next/navigation";
import { Boxes } from "./ui/background-boxes";
import axios from "axios";
import Link from "next/link";

// Define the interface for the student data
interface Student {
  username: string;
}

interface GoodBadStudent {
  student: string;
  reason: string;
}

const StudentTable: React.FC = () => {
  const router = useRouter();
  const [students, setStudents] = useState<Student[] | null>(null);
  const [goodStudents, setGoodStudents] = useState<GoodBadStudent[]>([]);
  const [badStudents, setBadStudents] = useState<GoodBadStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState<string | undefined>();
  const [message, setMessage] = useState<string>("");
  const [decodedClassName, setDecodedClassName] = useState("");
  const [noiseData, setNoiseData] = useState<any>(null);
  const params = useParams();
  useEffect(() => {
    // Retrieve the teacher's username from local storage
    const teacherData = JSON.parse(localStorage.getItem("user") || "{}");

    const username = teacherData.username;
    setTeacherName(username);
    const className = params?.className
      ? decodeURIComponent(params.className as string)
      : "";
    setDecodedClassName(className);
    // Fetch good and bad students data
    const fetchGoodBadStudents = async () => {
      try {
        const response = await axios.post(`/api/teacher/student-status`, {
          teacherName: username,
        });
        setGoodStudents(response.data.goodStudents);
        setBadStudents(response.data.badStudents);
        console.log(response);
      } catch (error) {
        console.error("Error fetching good and bad students:", error);
      }
    };

    const noiseInfo = async () => {
      try {
        const response = await axios.post("/api/teacher/noise-data", {
          teacherName: username,
        });

        // Extract the last noise data from the response
        const { lastNoiseData } = response.data;

        console.log("Last Noise Data:", lastNoiseData);
        setNoiseData(lastNoiseData);
      } catch (error: any) {
        console.error(
          "Error fetching noise data:",
          error.response?.data?.message || error.message
        );
      }
    };

    // Fetch student data
    const fetchStudents = async () => {
      try {
        const response = await axios.post(`/api/teacher/get-all-students`, {
          username,
        });
        setStudents(response.data.students);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoodBadStudents();
    fetchStudents();
    noiseInfo();

    if (students?.length === 0) {
      setMessage("No student available!");
    }
  }, []);

  const handleCardClick = (studentName: string) => {
    router.push(`/teacherinfo/${studentName}`);
  };

  if (loading) return <div className="text-center mt-40">Loading...</div>;

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      <div className="relative p-6 w-full mt-5">
        <div className="mb-6 text-center mt-32">
          {noiseData !== null ? (
            noiseData.noice < 50 ? (
              <div className="bg-green-500 text-white p-4 rounded">
                Noise level is low: {noiseData.noice}%. The classroom is quiet.
              </div>
            ) : noiseData.noice >= 50 && noiseData.noice < 75 ? (
              <div className="bg-yellow-500 text-white p-4 rounded">
                Noise level is moderate: {noiseData.noice}%. Please try to
                reduce noise in the classroom.
              </div>
            ) : (
              <div className="bg-red-500 text-white p-4 rounded">
                Noise level is high: {noiseData.noice}%. The classroom is too
                noisy.
              </div>
            )
          ) : (
            <p className="text-white">Fetching noise data...</p>
          )}
        </div>

        {/* Good and Bad Students Table */}
        <div className="overflow-x-auto shadow-md sm:rounded-lg z-20 relative mb-10">
          <h2 className="text-2xl  font-bold mb-4 text-center text-white">
            Students with highlighted performance
          </h2>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Student Name
                </th>
                <th scope="col" className="py-3 px-6">
                  Reason
                </th>
              </tr>
            </thead>
            <tbody>
              {goodStudents.map((student: any) => (
                <tr
                  key={student.student}
                  onClick={() => handleCardClick(student.username)}
                  className="bg-green-100 border-b dark:bg-green-900 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800"
                >
                  <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">
                    {student.username}
                  </td>
                  <td className="py-4 px-6 underline">
                    click to see {student.reason}{" "}
                  </td>
                </tr>
              ))}
              {badStudents.map((student: any) => (
                <tr
                  key={student.student}
                  onClick={() => handleCardClick(student.username)}
                  className="cursor-pointer bg-red-100 border-b dark:bg-red-900 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-800"
                >
                  <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">
                    {student.username}
                  </td>
                  <td className="py-4 px-6 underline">{student.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-blue-300 underline mb-2">
          <Link href={`/teacher/${decodedClassName}/groups`}>
            Click here to see groups in class.
          </Link>
        </p>
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          All Student Information
        </h1>
        {/* All Students Table */}
        <div className="overflow-x-auto shadow-md sm:rounded-lg z-20 relative">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Student Name
                </th>
                <th scope="col" className="py-3 px-6">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {students &&
                students.map((student) => (
                  <tr
                    key={student.username}
                    className="bg-white border-b dark:bg-zinc-900 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleCardClick(student.username)}
                  >
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">
                      {student.username}
                    </td>
                    <td className="py-4 px-6 text-blue-500 underline">
                      Click here to see report
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {message && (
            <p className="text-red-200 mt-5 text-center">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const GroupwiseBehaviorReport = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-6">
      {/* Group 1 */}
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Group (Frequency 3)</h3>
        <ul className="mb-4">
          <li>
            arijit: <span className="text-green-400">Good Student</span>
          </li>
          <li>
            abhisri: <span className="text-yellow-400">Moderate Attention</span>
          </li>
        </ul>
        <p className="text-sm">
          Action: This group includes both good students and those requiring
          moderate attention. Assign tasks that challenge the more attentive
          students while encouraging moderate attention students to stay
          focused.
        </p>
      </div>

      {/* Group 2 */}
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Group (Frequency 3)</h3>
        <ul className="mb-4">
          <li>
            arijit: <span className="text-green-400">Good Student</span>
          </li>
          <li>
            debajit: <span className="text-yellow-400">Moderate Attention</span>
          </li>
        </ul>
        <p className="text-sm">
          Action: This group includes both good students and those requiring
          moderate attention. Assign tasks that challenge the more attentive
          students while encouraging moderate attention students to stay
          focused.
        </p>
      </div>

      {/* Group 3 */}
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Group (Frequency 2)</h3>
        <ul className="mb-4">
          <li>
            priyam: <span className="text-green-400">Good Student</span>
          </li>
          <li>
            abhisri: <span className="text-yellow-400">Moderate Attention</span>
          </li>
        </ul>
        <p className="text-sm">
          Action: This group includes both good students and those requiring
          moderate attention. Assign tasks that challenge the more attentive
          students while encouraging moderate attention students to stay
          focused.
        </p>
      </div>

      {/* Group 4 */}
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Group (Frequency 2)</h3>
        <ul className="mb-4">
          <li>
            abhisri: <span className="text-yellow-400">Moderate Attention</span>
          </li>
          <li>
            ankan: <span className="text-yellow-400">Moderate Attention</span>
          </li>
        </ul>
        <p className="text-sm">
          Action: All students require moderate attention. It is suggested to
          monitor their engagement and occasionally offer additional guidance.
        </p>
      </div>

      {/* Group 5 */}
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Group (Frequency 2)</h3>
        <ul className="mb-4">
          <li>
            arijit: <span className="text-green-400">Good Student</span>
          </li>
          <li>
            ankan: <span className="text-yellow-400">Moderate Attention</span>
          </li>
        </ul>
        <p className="text-sm">
          Action: This group includes both good students and those requiring
          moderate attention. Assign tasks that challenge the more attentive
          students while encouraging moderate attention students to stay
          focused.
        </p>
      </div>

      {/* Group 6 */}
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Group (Frequency 1)</h3>
        <ul className="mb-4">
          <li>
            arijit: <span className="text-green-400">Good Student</span>
          </li>
          <li>
            priyam: <span className="text-green-400">Good Student</span>
          </li>
        </ul>
        <p className="text-sm">
          Action: All students are performing well. They can be assigned to work
          on a project together.
        </p>
      </div>

      {/* Group 7 */}
      <div className="bg-gray-800 text-white opacity-100 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Group (Frequency 1)</h3>
        <ul className="mb-4">
          <li>
            ankan: <span className="text-yellow-400">Moderate Attention</span>
          </li>
          <li>
            debajit: <span className="text-yellow-400">Moderate Attention</span>
          </li>
        </ul>
        <p className="text-sm">
          Action: All students require moderate attention. It is suggested to
          monitor their engagement and occasionally offer additional guidance.
        </p>
      </div>
    </div>
  );
};

export default StudentTable;
