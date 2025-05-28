'use client'
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import html2canvas from "html2canvas"; 
import jsPDF from "jspdf";

// Define the structure for WeeklyCardProps including behavior data
interface BehaviorData {
  distractionTime: string;
  totalInClass: string;
  attentive: string;
  responsive: string;
  handRaising?: string;
  reading?: string;
  turnAround?: string;
  lookingForward?: string;
  writing?: string;
  usingPhone?: string;
  sleeping?: string;
  totalAttendance?: string;
}

interface WeeklyCardProps {
  studentName: string;
  behaviorData: BehaviorData;
}

const WeeklyCard: React.FC<WeeklyCardProps> = ({
  studentName,
  behaviorData
}) => {
    // Destructure behavior data
    const {
      distractionTime,
      totalInClass,
      attentive,
      responsive,
      handRaising,
      reading,
      turnAround,
      lookingForward,
      writing,
      usingPhone,
      sleeping,
      totalAttendance
    } = behaviorData;

    const pdfRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const [teacherName, setTeacherName] = useState("");
    const studentRouteName = studentName;  // Fallback to studentName if router isn't ready

    useEffect(() => {
      // Fetch the teacher name from local storage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setTeacherName(user.username || 'Unknown');
    }, []);

    const handleDownload = () => {
        const input = pdfRef.current;
        if (input) {
          html2canvas(input, { scale: 3 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 10;
            const fileName = `Weekly_Report_${studentName}.pdf`;
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(fileName);
          });
        }
    };

  return (
    <div className="p-4">
      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] rounded-xl p-6 border">
          <div ref={pdfRef} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <CardItem
              translateZ="50"
              className="text-xl font-semibold text-gray-800 dark:text-white"
            >
              Weekly Performance Report
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-sm text-gray-600 dark:text-gray-400 mt-2"
            >
              Detailed insights into your weekly class performance, including attention, participation, and more.
            </CardItem>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-gray-800 dark:text-white">
                <span className="font-semibold">Teacher Name:</span>
                <span>{teacherName}</span>
              </div>
              <div className="flex justify-between text-gray-800 dark:text-white">
                <span className="font-semibold">Student Name:</span>
                <span>{studentRouteName}</span>
              </div>
              <div className="flex justify-between text-gray-800 dark:text-white">
                <span className="font-semibold">Distraction Time:</span>
                <span>{distractionTime}</span>
              </div>
              <div className="flex justify-between text-gray-800 dark:text-white">
                <span className="font-semibold">Total In Class:</span>
                <span>{totalInClass}</span>
              </div>
              <div className="flex justify-between text-gray-800 dark:text-white">
                <span className="font-semibold">Attentive:</span>
                <span>{attentive}</span>
              </div>
              <div className="flex justify-between text-gray-800 dark:text-white">
                <span className="font-semibold">Responsive:</span>
                <span>{responsive}</span>
              </div>
              {handRaising && (
                <div className="flex justify-between text-gray-800 dark:text-white">
                  <span className="font-semibold">Hand Raising:</span>
                  <span>{handRaising}</span>
                </div>
              )}
              {reading && (
                <div className="flex justify-between text-gray-800 dark:text-white">
                  <span className="font-semibold">Reading:</span>
                  <span>{reading}</span>
                </div>
              )}
              {turnAround && (
                <div className="flex justify-between text-gray-800 dark:text-white">
                  <span className="font-semibold">Turning Around:</span>
                  <span>{turnAround}</span>
                </div>
              )}
              {lookingForward && (
                <div className="flex justify-between text-gray-800 dark:text-white">
                  <span className="font-semibold">Looking Forward:</span>
                  <span>{lookingForward}</span>
                </div>
              )}
              {writing && (
                <div className="flex justify-between text-gray-800 dark:text-white">
                  <span className="font-semibold">Writing:</span>
                  <span>{writing}</span>
                </div>
              )}
              {usingPhone && (
                <div className="flex justify-between text-gray-800 dark:text-white">
                  <span className="font-semibold">Using Phone:</span>
                  <span>{usingPhone}</span>
                </div>
              )}
              {sleeping && (
                <div className="flex justify-between text-gray-800 dark:text-white">
                  <span className="font-semibold">Sleeping:</span>
                  <span>{sleeping}</span>
                </div>
              )}
              {totalAttendance && (
                <div className="flex justify-between text-gray-800 dark:text-white">
                  <span className="font-semibold">Total Attendance:</span>
                  <span>{totalAttendance}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center mt-6">
            <CardItem
              translateZ={20}
              as="button"
              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
              onClick={handleDownload}
            >
              Download
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
};

export default WeeklyCard;
