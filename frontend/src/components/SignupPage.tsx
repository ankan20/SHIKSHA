"use client"
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Logo from '../../public/logo-removebg-preview.png'
import Image from "next/image"; 

type Role = 'admin' | 'teacher' | 'student';

interface Images {
  front: File | null;
  left: File | null;
  right: File | null;
  up: File | null;
}

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student'); // Default role to student
  const [images, setImages] = useState<Images>({ front: null, left: null, right: null, up: null });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // To handle success message color
  const router = useRouter();

  const handleImageChange = (e: any, position: keyof Images) => {
    if (e.target.files && e.target.files[0]) {
      setImages((prevImages) => ({ ...prevImages, [position]: e.target.files[0] }));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure all images are uploaded if the role is 'student'
    if (role === 'student' && (Object.values(images).some((image) => image === null))) {
      setMessage('Please upload all required images.');
      setIsSuccess(false);
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('role', role);

    // Append images to FormData only if they are provided
    Object.entries(images).forEach(([key, file]) => {
      if (file) {
        formData.append(`images.${key}`, file);
      }
    });

    try {
      const response = await axios.post('/api/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (response.status === 201) {
        setMessage('Signup successful!');
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/login'); // Use router.push instead
        }, 1000); // Delay for a smoother user experience
      } else {
        throw new Error('Signup failed.');
      }

    } catch (error) {
      console.error('Signup error:', error);
      setMessage('Signup failed.');
      setIsSuccess(false);
    }
  };

  return (
    <div>
       {/* <form onSubmit={handleSignup} className="flex flex-col max-w-md p-6 mx-auto mt-10 bg-gray-800 rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-center text-primary">Signup on Shiksha</h2>
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
        onChange={(e) => setRole(e.target.value as Role)}
        className="p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
      >
        <option value="admin">Admin</option>
        <option value="teacher">Teacher</option>
        <option value="student">Student</option>
      </select>

      {role === 'student' && (
        <div className="mb-4">
          <div className="mb-2">
            <label>Front-facing Image:</label>
            <input
              type="file"
              onChange={(e) => handleImageChange(e, 'front')}
              accept="image/*"
              required
              className="block w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded"
            />
          </div>
          <div className="mb-2">
            <label>Left Side-facing Image:</label>
            <input
              type="file"
              onChange={(e) => handleImageChange(e, 'left')}
              accept="image/*"
              required
              className="block w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded"
            />
          </div>
          <div className="mb-2">
            <label>Right Side-facing Image:</label>
            <input
              type="file"
              onChange={(e) => handleImageChange(e, 'right')}
              accept="image/*"
              required
              className="block w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded"
            />
          </div>
          <div className="mb-2">
            <label>Up-facing Image:</label>
            <input
              type="file"
              onChange={(e) => handleImageChange(e, 'up')}
              accept="image/*"
              required
              className="block w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded"
            />
          </div>
        </div>
      )}

      <button type="submit" className="p-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600">Signup</button>
      {message && (
        <p className={`mt-4 text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
      <p className="text-sm font-normal text-white mt-4">Login if already a user ,
        <Link href={"/login"} className="text-blue-400 hover:underline ml-2">login</Link>
      </p>
    </form> */}
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 flex items-center">
        Welcome to <Image src={Logo} alt="Logo" width={70} height={50} className="rounded-full " />
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Sign up for Shiksha if you're new here.
      </p>
 
      <form className="my-8" onSubmit={handleSignup}>
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
          <Input id="password" placeholder="••••••••" type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required />
        </LabelInputContainer>
        <select
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        className="p-2 mb-4 bg-gray-50 dark:bg-zinc-800 border border-gray-600 rounded w-full cursor-pointer"
      >
        <option value="admin" className="cursor-pointer">Admin</option>
        <option value="teacher" className="cursor-pointer">Teacher</option>
        <option value="student" className="cursor-pointer">Student</option>
      </select>

      {role === 'student' && (
        <div className="mb-4 ">
          <div className="mb-2 ">
            <LabelInputContainer >
            <Label htmlFor="firstname">Front-facing Image</Label>
            <Input type="file"
            className='cursor-pointer'
              onChange={(e) => handleImageChange(e, 'front')}
              accept="image/*"
              required />
            </LabelInputContainer>
          </div>
          <div className="mb-2">
          <LabelInputContainer >
            <Label htmlFor="firstname">Left Side-facing Image</Label>
            <Input type="file"
            className='cursor-pointer'
              onChange={(e) => handleImageChange(e, 'left')}
              accept="image/*"
              required />
            </LabelInputContainer>
          </div>
          <div className="mb-2">
          <LabelInputContainer >
            <Label htmlFor="firstname">Right Side-facing Image</Label>
            <Input type="file"
            className='cursor-pointer'
              onChange={(e) => handleImageChange(e, 'right')}
              accept="image/*"
              required />
            </LabelInputContainer>
            
          </div>
          <div className="mb-2">
          <LabelInputContainer >
            <Label htmlFor="firstname">Up-facing Image</Label>
            <Input type="file"
            className='cursor-pointer'
              onChange={(e) => handleImageChange(e, 'up')}
              accept="image/*"
              required/>
            </LabelInputContainer>
          </div>
        </div>
      )}
 
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        {message && (
        <p className={`mt-4 text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
      <p className="text-sm font-normal text-white mt-4">Login if already a user ,
        <Link href={"/login"} className="text-blue-400 hover:underline ml-2">login</Link>
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






export default Signup;
