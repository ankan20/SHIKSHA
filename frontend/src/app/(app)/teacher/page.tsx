"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TeacherCard from '@/components/TeacherCard';
import classData from '@/data/teacher_class.json';

interface Class {
  className: string;
  date: string;
}

const Page = () => {
  const [user, setUser] = useState<{ role?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const classNames: Class[] = classData.class;

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'teacher') {
        setUser(parsedUser);
        setLoading(false);
      } else {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  if (loading) return <p className='mt-40 text-center'>Loading...</p>;

  return (
    <div>
      <div className="h-[50rem] w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <span className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
          <h2 className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl text-center mb-2'>Class Details & Student Insights</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {classNames.map(({ className, date }) => (
              <div key={className}>
                <TeacherCard className={className} date={date} />
              </div>
            ))}
          </div>
        </span>
      </div>
    </div>
  );
};

export default Page;
