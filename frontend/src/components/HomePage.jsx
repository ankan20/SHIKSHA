"use client";
import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/moving-border";
import { FlipWords } from "@/components/ui/flip-words";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function AuroraBackgroundDemo() {
  const words = ["management", "tracking", "evaluation", "exams", "attendance"];
  const router = useRouter();

  // Function to handle the navigation based on user role
  const handleNavigation = () => {
    const userRole = localStorage.getItem("userRole"); // Get userRole from localStorage
    if (userRole) {
      if (userRole === "admin") {
        router.push("/admin"); // Redirect to admin dashboard
      } else if (userRole === "teacher") {
        router.push("/teacher"); // Redirect to teacher dashboard
      } else if (userRole === "student") {
        router.push("/student"); // Redirect to student dashboard
      }
    } else {
      router.push("/login"); // If no userRole, send them to the login page
    }
  };

  return (
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
        <div className="text-3xl md:text-4xl font-bold dark:text-white text-center">
          Say Goodbye to Errors Experience Hassle-Free{" "}
          <div className="inline text-blue-300">
            <FlipWords words={words} />
          </div>{" "}
          with <span className="text-blue-300">SHIKSHA</span>
        </div>
        <p className="mt-4 font-normal text-base md:text-lg text-neutral-300 max-w-[70%] mx-auto">
          Unlock the future of education with{" "}
          <span className="text-blue-300">SHIKSHA</span>. Designed for both
          teachers and students, Shiksha enhances classroom experiences through
          advanced behaviour monitoring and automated attendance. Our intelligent
          analytics provide valuable insights into student performance, while
          smart QR code integration ensures seamless exam tracking with perfect
          accuracy. Empower your institution with Shiksha's cutting-edge
          technology to foster a smarter, more efficient learning environment.
        </p>

        {/* Button with role-based redirection */}
        <Button
          borderRadius="1.75rem"
          className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
          onClick={handleNavigation} // Call handleNavigation on button click
        >
          Let's go
        </Button>
      </motion.div>
    </AuroraBackground>
  );
}
