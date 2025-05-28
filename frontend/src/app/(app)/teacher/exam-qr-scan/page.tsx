"use client";
import React, { useState, useEffect, useRef } from "react";
import QrScanner from "qr-scanner"; // Import qr-scanner
import { BackgroundLines } from "@/components/ui/background-lines";

export default function TeacherScanQR() {
  const [isTeacher, setIsTeacher] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [examPaperBarcode, setExamPaperBarcode] = useState<string | null>(null);
  const [studentBarcode, setStudentBarcode] = useState<string | null>(null);
  const [scanRequested, setScanRequested] = useState<"exam" | "student" | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setIsTeacher(userRole === "teacher");
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

  const startScanner = (type: "exam" | "student") => {
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

  const handleScan = (barcode: string, type: "exam" | "student") => {
    console.log("Handling scanned data:", barcode);

    if (type === "exam" && barcode.startsWith("EXAM") && !examPaperBarcode) {
      setExamPaperBarcode(barcode);
      alert("Exam paper barcode scanned successfully.");
      setScanRequested(null); // Stop scanning after successful scan
    } else if (type === "student" && !studentBarcode) {
      setStudentBarcode(barcode);
      alert("Student ID card barcode scanned successfully.");
      setScanRequested(null); // Stop scanning after successful scan
    }
  };

  const submitBarcodes = async () => {
    if (examPaperBarcode && studentBarcode) {
      try {
        const response = await fetch("/api/teacher/scan-exam-qr", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            examBarcode: examPaperBarcode,
            studentBarcode:studentBarcode,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to process barcodes.");
        }

        alert("Barcodes processed successfully.");
        setExamPaperBarcode(null);
        setStudentBarcode(null);
        setScanRequested(null);
      } catch (error: any) {
        setError(error.message);
      }
    } else {
      setError("Both barcodes must be scanned before submission.");
    }
  };

  if (!isTeacher) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4 dark:bg-gray-800">
          <p className="text-red-500 text-center font-bold">
            Please log in as teacher to see this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 ">
    <div className="flex flex-col items-center justify-center h-screen absolute z-30">
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 dark:bg-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Teacher QRcode Scanner
        </h2>
        <p className="text-center text-gray-700 dark:text-gray-300">
          {examPaperBarcode && studentBarcode
            ? "Both barcodes scanned. Review below and submit."
            : "Please scan the barcodes for both the exam paper and student ID card."
          }
        </p>

        {!examPaperBarcode && (
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setScanRequested("exam")}
          >
            Scan Exam Paper QRcode
          </button>
        )}
        
        {!studentBarcode && examPaperBarcode && (
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setScanRequested("student")}
          >
            Scan Student ID QRcode
          </button>
        )}

        {examPaperBarcode && studentBarcode && (
          <>
            <div className="text-center mt-4">
              <p className="text-green-600">Exam Paper QRcode: {examPaperBarcode}</p>
              <p className="text-green-600">Student ID QRcode: {studentBarcode}</p>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={submitBarcodes}
            >
              Submit QRcodes
            </button>
          </>
        )}

        <video ref={videoRef} className="w-full mt-4" />
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
    </div>
    </BackgroundLines>
  );
}
