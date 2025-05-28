"use client"
import AddStudentForm1 from '@/components/AddStudentForm'; // Adjust the import path based on your folder structure
import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
const AddStudentForm = () => {
  return (
    <div>
      
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
      <AddStudentForm1 />
      </motion.div>
    </AuroraBackground>
    </div>
  );
};

export default AddStudentForm;
