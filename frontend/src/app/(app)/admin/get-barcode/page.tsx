"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QRCode from 'qrcode';
import { saveAs } from 'file-saver';
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";



const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};


export default function GetQRCode() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string | null>(null);
  const [barcode, setBarcode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is an admin
    const userRole = localStorage.getItem("userRole");
    if (userRole === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  const generateQRCode = async (barcodeValue :any) => {
    
    setBarcode(barcodeValue);

    try {
      // Generate QR code image
      const qrCodeDataURL = await QRCode.toDataURL(barcodeValue, {
        width: 300,
        margin: 1,
      });
      setQrCodeDataURL(qrCodeDataURL);

      // Trigger download of the QR code image using the barcode returned from backend
      saveAs(qrCodeDataURL, `${barcodeValue}.png`);
    } catch (error: any) {
      setError("Failed to generate QR code.");
    }
  };

  const saveBarcode = async () => {
    try {
      const response = await fetch("/api/barcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ barcode:"EXAM-1111111" }),
      });

      if (!response.ok) {
        throw new Error("Failed to save barcode.");
      }

      // Extract the saved barcode value from the response
      const data = await response.json();
      const savedBarcode = data.barcode; // Assuming backend returns the saved barcode as `barcode`
      console.log(savedBarcode)
      await generateQRCode(savedBarcode);
      alert("Barcode saved successfully.");
    } catch (error: any) {
      setError(error.message);
      throw error; // Ensure the error is thrown so generateQRCode handles it
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4 dark:bg-gray-800">
          <p className="text-red-500 text-center font-bold">Please log in as admin to see this page.</p>
        </div>
      </div>
    );
  }

  return (
    <BackgroundBeamsWithCollision>
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 dark:bg-gray-800 mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin QR Code Generator</h2>
          {/* <button
            onClick={generateQRCode}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Generate and Download QR Code
          </button> */}
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] p-2"
            onClick={async ()=>await saveBarcode()}
          >
            Generate and Download QR Code
            <BottomGradient />
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {qrCodeDataURL && (
            <div className="text-center">
              <img src={qrCodeDataURL} alt="Generated QR Code" className="mx-auto" />
              <p className="text-center text-gray-700 dark:text-gray-300">Generated QR Code: {barcode}</p>
            </div>
          )}
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
