"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TeacherTable from "@/components/TeacherTable";

function AdminPage() {
  const [user, setUser] = useState<{ role?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'admin') {
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
      
      <TeacherTable />
    </div>
  );
}

export default AdminPage;
