"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";



function AddTeacherPage() {
  const [teacherUsername, setTeacherUsername] = useState("");
  const [adminId, setAdminId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve admin ID from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role === 'admin') {
        setAdminId(user.id);
      } else {
        // Handle case where user is not an admin
        router.push('/login');
      }
    } else {
      // Redirect to login if no user data is found
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!adminId) {
      setError('Admin ID is not available');
      return;
    }

    try {
      const response = await fetch('/api/admin/add-teacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teacherUsername, adminId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add teacher');
      }

      setSuccessMessage(`Teacher ${teacherUsername} added successfully!`);
      setTeacherUsername(""); // Clear input field
      setTimeout(()=>setSuccessMessage(""),3000)
    } catch (error: any) {
      setError(error.message);
      setTimeout(()=>setError(""),3000)
    }
  };

  return (
    <div >
      
      {/* <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="teacherUsername" className="block text-sm font-medium">Teacher Username</label>
          <input
            id="teacherUsername"
            type="text"
            value={teacherUsername}
            onChange={(e) => setTeacherUsername(e.target.value)}
            required
            className="w-full min-h-8 border-gray-300 rounded-md shadow-sm text-black"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-200">Add Teacher</button>
      </form> */}

      <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
      Add Student to Your Class
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Enter student usernames here to add.
      </p>
    
     <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4 mt-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">Username</Label>
            <Input id="teacherUsername"
            type="text"
            value={teacherUsername}
            onChange={(e) => setTeacherUsername(e.target.value)}
            required />
          </LabelInputContainer>
          
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
        
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] cursor-pointer"
          onClick={handleSubmit}
          
        >
           Add Teacher &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </div>
      </motion.div>
    </AuroraBackground>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
 
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );

}

export default AddTeacherPage;
