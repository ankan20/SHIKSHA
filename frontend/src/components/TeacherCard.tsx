"use client";
import Link from "next/link"
import { BackgroundGradient } from "./ui/background-gradient"

const TeacherCard = ({className,date}:{className:string,date:string}) => {
  return (
    
      <div className="flex justify-center">
              <BackgroundGradient className="flex flex-col rounded-[22px] bg-white dark:bg-zinc-900 overflow-hidden h-full max-w-sm">
                <div className="p-4 sm:p-6 flex flex-col items-center text-center flex-grow">
                  <p className="text-lg sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">{className}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 font-extrabold">Date: {date}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis, eaque.</p>
                  <Link href={`/teacher/${className}`}>
                    <p className="px-4 py-2 text-2xl rounded bg-teal-600 text-white hover:bg-teal-700 transition duration-200">
                      View Analytics
                    </p>
                  </Link>
                </div>
              </BackgroundGradient>
            </div>
  )
}

export default TeacherCard
