"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Boxes } from "./ui/background-boxes";
import Link from "next/link";

interface Teacher {
  username: string;
  _id:string;
}

const TeacherTable: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTeachers = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const adminId = user.id;

      if (!adminId) {
        setError('Admin ID is missing');
        return;
      }

      try {
        const response = await fetch('/api/admin/teachers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ adminId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch teachers');
        }

        const data = await response.json();
        setTeachers(data.teachers);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchTeachers();
  }, []);

  const handleCardClick = (name: string) => {
    router.push(`/admin/${name}`);
  };

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg ">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      <div className="relative p-6 -mt-24 w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">
          All Teachers's Information
        </h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {
            teachers.length===0 && <div><p className="text-center text-red-400">You don't have any teachers assigned to you. Please add teachers to your list.Click here to add  <Link href="/admin/add-teacher" className="text-blue-300 underline cursor-pointer">add teachers</Link></p>
           </div>
          }
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 z-20 relative">
         
          {teachers.map((teacher) => (
            <div
              key={teacher._id}
              className="p-4 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleCardClick(teacher.username)}
            >
              <h2 className="text-lg font-semibold text-black dark:text-white">
                Teacher Name : {teacher.username}
              </h2>
              <p className="text-blue-200">click to upload video</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherTable;
