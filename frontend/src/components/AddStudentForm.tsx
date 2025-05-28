import React, { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
const AddStudentForm: React.FC = () => {
  const [studentUsername, setStudentUsername] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  // Retrieve the teacher ID from local storage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.id) {
          setTeacherId(user.id);
        } else {
          console.error('Teacher ID is missing in local storage');
        }
      } catch (error) {
        console.error('Error parsing user data from local storage:', error);
      }
    } else {
      console.error('No user found in local storage');
    }
  }, []);
  

  const handleCheckUsername = useCallback(
    debounce(async (username: string) => {
      try {
        const response = await fetch('/api/teacher/check-student', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });
        const result = await response.json();
        setUsernameValid(result.valid);
      } catch (error) {
        console.error('Error checking student:', error);
      }
    }, 500),
    []
  );

  const handleAddStudent = async () => {
    if (!usernameValid) {
      setError('Student username is invalid or does not exist.');
      return;
    }

    try {
      const response = await fetch('/api/teacher/add-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teacherId, studentUsername }),
      });

      if (!response.ok) {
        const result = await response.json();
         throw Error(result.error)
         
      }
      
      const result = await response.json();
      console.log(result)
      setMessage(`Student ${studentUsername} added successfully.`);
      setStudentUsername(''); // Clear the input field
      setError(null); // Clear previous error message
    } catch (error: any) {
      setStudentUsername('');
      setError(error.message);
      setMessage(null); // Clear previous success message
      setTimeout(()=>setError(""),3000)
    }
  };

  return (
    // <div className="min-h-screen flex flex-col items-center justify-center ">
    //   <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
    //     <h1 className="text-2xl font-bold mb-4">Add Student to Your Class</h1>
    //     {error && <p className="text-red-500">{error}</p>}
    //     {message && <p className="text-green-500">{message}</p>}
    //     <input
    //       type="text"
    //       value={studentUsername}
    //       onChange={(e) => {
    //         const newUsername = e.target.value;
    //         setStudentUsername(newUsername);
    //         handleCheckUsername(newUsername);
    //       }}
    //       placeholder="Enter Student Username"
    //       className="border border-gray-300 dark:border-gray-700 p-2 rounded-md w-full mb-4 text-black"
    //     />
    //     {usernameValid === false && <p className="text-red-500">{studentUsername +" is not a valid student username"}</p>}
    //     {usernameValid === true && <p className="text-green-500">{studentUsername +" is a valid student username"}</p>}
    //     <button
    //       onClick={handleAddStudent}
    //       className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
    //       disabled={usernameValid === null || usernameValid === false} // Disable button until validation is complete and valid
    //     >
    //       Add Student
    //     </button>
    //   </div>
    // </div>
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
      Add Student to Your Class
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Enter student usernames here to add.
      </p>
    
     <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">Username</Label>
            <Input type="text"
          value={studentUsername}
          onChange={(e) => {
            const newUsername = e.target.value;
            setStudentUsername(newUsername);
            handleCheckUsername(newUsername);
          }}
           placeholder="Enter Student Username" />
          </LabelInputContainer>
          
        </div>
        {error && studentUsername ==="" && <p className="text-red-500">{error}</p>}
        {message && studentUsername ==="" &&  <p className="text-green-500">{message}</p>}
        {usernameValid === false && studentUsername !=="" && <p className="text-red-500">{studentUsername +" is not a valid student username"}</p>}
        {usernameValid === true && studentUsername !=="" && <p className="text-green-500">{studentUsername +" is a valid student username"}</p>}
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] cursor-pointer"
          onClick={handleAddStudent}
          disabled={usernameValid === null || usernameValid === false}
        >
           Add Student &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
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



export default AddStudentForm;
