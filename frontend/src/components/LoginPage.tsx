"use client"
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Logo from '../../public/logo-removebg-preview.png'
import Image from "next/image"; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'teacher' | 'student'>('student'); // Default role to student
  const [message, setMessage] = useState('');
  const [checkMessage,setCheckMessage]=useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login', { username, password, role });
      if (response.data.success) {
        // Save user data in localStorage
        localStorage.setItem('user', JSON.stringify({
          id: response.data.user.id,
          username: response.data.user.username,
          role: response.data.user.role,
        }));
        localStorage.setItem('userRole',response.data.user.role)
        setMessage('Login successful!');
        setCheckMessage(true);
        router.replace(`/${role}`); // Navigate to the appropriate dashboard based on role
      } else {
        setMessage('Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Login failed.');
      setCheckMessage(false);
    }
  };

  return (
    <div>
      {/* <form onSubmit={handleLogin} className="flex flex-col max-w-md p-6 mx-auto mt-10 bg-gray-800 rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-center text-primary">Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as 'admin' | 'teacher' | 'student')}
        className="p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
      >
        <option value="admin">Admin</option>
        <option value="teacher">Teacher</option>
        <option value="student">Student</option>
      </select>

      <button type="submit" className="p-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600">Login</button>
      {message && checkMessage && <p className="mt-4 text-center text-green-500">{message}</p>}
      {message && !checkMessage && <p className="mt-4 text-center text-red-500">{message}</p>}
      <p className="text-sm font-normal text-white mt-4">signup if not yet ,
        <Link href={"/signup"} className="text-blue-400 hover:underline ml-2">signup</Link>
      </p>
    </form> */}
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 flex items-center">
        Welcome back to  <Image src={Logo} alt="Logo" width={70} height={50} className="rounded-full" />
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Login for Shiksha if you're not new here.
      </p>
 
      <form className="my-8" onSubmit={handleLogin}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">Username</Label>
            <Input type="text"
        placeholder="Tyler"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required />
          </LabelInputContainer>
         
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input  placeholder="••••••••" type="password"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         required />
        </LabelInputContainer>
        <select
         value={role}
         onChange={(e) => setRole(e.target.value as 'admin' | 'teacher' | 'student')}
        className="p-2 mb-4 bg-gray-50 dark:bg-zinc-800 border border-gray-600 rounded w-full cursor-pointer"
      >
        <option value="admin" className="cursor-pointer">Admin</option>
        <option value="teacher" className="cursor-pointer">Teacher</option>
        <option value="student" className="cursor-pointer">Student</option>
      </select>
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Login &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        {message && checkMessage && <p className="mt-4 text-center text-green-500">{message}</p>}
      {message && !checkMessage && <p className="mt-4 text-center text-red-500">{message}</p>}
      <p className="text-sm font-normal text-white mt-4">signup if not yet ,
        <Link href={"/signup"} className="text-blue-400 hover:underline ml-2">signup</Link>
      </p>
       
      </form>
    </div>
    
    </div>
  );
};


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
};


export default Login;
