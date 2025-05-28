"use client";
import React, { useState, useEffect, useRef } from "react";
import QrScanner from "qr-scanner"; // Import qr-scanner
import { BackgroundLines } from "@/components/ui/background-lines";

export default function AdminScanQR() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [examPaperBarcode, setExamPaperBarcode] = useState<string | null>(null);
  const [scanRequested, setScanRequested] = useState<"exam" | null>(null);
  const [studentDetails, setStudentDetails] = useState<any>(null); // State to store student details
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [exam,setExam]= useState<string |null>(null);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setIsAdmin(userRole === "teacher");
  }, []);

  useEffect(() => {
    if (scanRequested) {
      startScanner(scanRequested);
    }

    return () => {
      // Clean up the scanner on component unmount or when changing scans
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }
    };
  }, [scanRequested]);

  const startScanner = (type: "exam") => {
    if (videoRef.current) {
      // Initialize QrScanner with video element
      const qrScanner = new QrScanner(
        videoRef.current,
        (result: QrScanner.ScanResult) => handleScan(result.data, type),
        {
          preferredCamera: "environment", // Prefer the environment camera
        }
      );

      qrScannerRef.current = qrScanner;

      qrScanner.start().catch((err) => {
        console.error("Failed to start QR scanner:", err);
        setError("Failed to access the camera. Please ensure permissions are granted.");
      });
    }
  };

  const handleScan = (barcode: string, type: "exam") => {
    console.log("Handling scanned data:", barcode);

    if (type === "exam" && barcode.startsWith("EXAM") && !examPaperBarcode) {
      setExamPaperBarcode(barcode);
      alert("Exam paper barcode scanned successfully.");
      setScanRequested(null); // Stop scanning after successful scan
    }
  };

  const submitBarcodes = async () => {
    if (examPaperBarcode) {
      try {
        const response = await fetch("/api/teacher-scan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ barcode: examPaperBarcode }),
        });

        if (!response.ok) {
          throw new Error("Failed to process barcodes.");
        }

        const details = await response.json();
        setExam(examPaperBarcode);
        setStudentDetails(details); // Set student details to state
        setExamPaperBarcode(null); // Reset barcode after successful submission
      } catch (error: any) {
        setError(error.message);
      }
    } else {
      setError("No barcode scanned. Please scan a QR code first.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4 dark:bg-gray-800">
          <p className="text-red-500 text-center font-bold">
            Please log in as Teacher to see this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BackgroundLines className=" w-full flex justify-center items-center px-4 ">
    <div className="flex items-center justify-center  bg-gray-100 dark:bg-gray-900 absolute z-40 mt-14 ">
  <div className="p-6 flex flex-col items-center max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-6 ">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
      Teacher QR Code Scanner 
    </h2>
    <p className="text-center text-gray-700 dark:text-gray-300">
      {examPaperBarcode
        ? "QR code scanned. Review below and submit."
        : "Please scan the QR code for the exam paper"}
    </p>

    {!examPaperBarcode && (
      <button
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
        onClick={() => setScanRequested("exam")}
      >
        Scan Exam Paper QR Code
      </button>
    )}

    {examPaperBarcode && (
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center">
          <p className="text-green-600 text-lg font-semibold">Exam Paper QR Code: {examPaperBarcode}</p>
        </div>
        <button
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
          onClick={submitBarcodes}
        >
          Submit QR Codes
        </button>
      </div>
    )}

    {studentDetails && (
      <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md text-black dark:text-white space-y-4 w-full">
        <h3 className="text-xl font-bold">Student Details</h3>
        <p><strong>Exam Paper QR Code:</strong> {exam}</p>
        <p><strong>Student ID:</strong> {studentDetails.id}</p>
        <p><strong>Name:</strong> {studentDetails.name}</p>
        <p><strong>Roll Number:</strong> {studentDetails.rollNumber}</p>
        <p><strong>Class:</strong> {studentDetails.className}</p>
        <p><strong>Attended Exam:</strong> {studentDetails.attended ? "Yes" : "No"}</p>
        {/* Add more fields as needed */}
      </div>
    )}
  {
    !studentDetails &&(<video ref={videoRef} className="w-full mt-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-600" />)
  }
    
    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
  </div>
</div>

</BackgroundLines>
  );
}

