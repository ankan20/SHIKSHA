// "use client";
// import { useState } from "react";
// import { BackgroundLines } from "@/components/ui/background-lines";

// export default function Page() {
//   const [image, setImage] = useState<File | null>(null); // To hold the image file
//   const [imagePreview, setImagePreview] = useState<string | null>(null); // To hold the image preview URL
//   const [submitting, setSubmitting] = useState(false); // To track submission state
//   const [responseData, setResponseData] = useState<string | null>(null); // To hold backend response

//   // Handle image selection and preview generation
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImage(file);
//       setImagePreview(URL.createObjectURL(file)); // Generate a preview URL
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!image) {
//       alert("Please select an image first.");
//       return;
//     }

//     setSubmitting(true); // Set button to submitting state

//     // Create FormData to send the image file to the backend
//     const formData = new FormData();
//     formData.append("image", image);

//     try {
//       // Send the image to the Python backend
//       const response = await fetch("http://localhost:5001/seat-check", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setResponseData(data.result); // Set the backend response
//       } else {
//         console.error("Error uploading the image");
//       }
//     } catch (error) {
//       console.error("Error occurred during submission:", error);
//     } finally {
//       setSubmitting(false); // Reset the submission state
//     }
//   };

//   return (
//     <>
//       <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 py-10">
//         <h1 className="text-3xl font-bold text-white mb-6">Exam Classroom Image Upload</h1>

//         {/* Form to capture the image */}
//         <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg z-50">
//           {/* File input for selecting the image */}
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             className="text-white border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500 cursor-pointer"
//           />

//           {/* Display the image preview if an image is selected */}
//           {imagePreview && (
//             <div className="w-64 h-64 mt-4 rounded-lg overflow-hidden shadow-md">
//               <img
//                 src={imagePreview}
//                 alt="Selected Preview"
//                 className="object-cover w-full h-full"
//               />
//             </div>
//           )}

//           {/* Submit button */}
//           <button
//             type="submit"
//             className={`w-full cursor-pointer px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-300 ease-in-out ${
//               submitting ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             disabled={submitting}
//           >
//             {submitting ? "Submitting..." : "Submit"}
//           </button>
//         </form>

//         {/* Display backend response if available */}
//         {responseData && (
//           <div className="mt-6 p-4 bg-green-600 text-white rounded-lg shadow-lg">
//             <h2 className="font-semibold">Backend Response:</h2>
//             <p>{responseData}</p>
//           </div>
//         )}
//       </BackgroundLines>
//     </>
//   );
// }


"use client";
import { useState } from "react";
import { BackgroundLines } from "@/components/ui/background-lines";

export default function Page() {
  const [image, setImage] = useState<File | null>(null); // To hold the image file
  const [imagePreview, setImagePreview] = useState<string | null>(null); // To hold the image preview URL
  const [submitting, setSubmitting] = useState(false); // To track submission state
  const [responseData, setResponseData] = useState<any | null>(null); // To hold backend response

  // Handle image selection and preview generation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Generate a preview URL
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image first.");
      return;
    }

    setSubmitting(true); // Set button to submitting state

    // Create FormData to send the image file to the backend
    const formData = new FormData();
    formData.append("image", image);

    try {
      // Send the image to the Python backend
      const response = await fetch("http://localhost:5001/seat-check", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResponseData(data.results); // Set the backend response
      } else {
        console.error("Error uploading the image");
      }
    } catch (error) {
      console.error("Error occurred during submission:", error);
    } finally {
      setSubmitting(false); // Reset the submission state
    }
  };

  return (
    <>
      <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-6">Seat-matrix verification</h1>

        {/* Form to capture the image and display response */}
        <div className="flex flex-col md:flex-row items-center md:space-x-10">
          {/* Upload section */}
          <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg z-50 md:w-full">
            {/* File input for selecting the image */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-white border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500 cursor-pointer"
            />

            {/* Display the image preview if an image is selected */}
            {imagePreview && (
              <div className="w-64 h-64 mt-4 rounded-lg overflow-hidden shadow-md">
                <img
                  src={imagePreview}
                  alt="Selected Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className={`w-full cursor-pointer px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-300 ease-in-out ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>

          {/* Response section */}
          {responseData && (
            <div className="mt-6 p-4 bg-gray-700 text-white rounded-lg shadow-lg md:w-1/2">
              <h2 className="font-semibold text-xl">Result Summary:</h2>
              {responseData.map((result: any, index: number) => (
                <div key={index} className="mt-2 p-2 border rounded-md bg-gray-800">
                  {result.status === 'Mismatch' ? (
                    <p className="text-orange-300">
                      <strong>Mismatch Detected:</strong> Current Seat: <span className="font-bold">{result.current_seat}</span>, Actual Seat: <span className="font-bold">{result.actual_seat}</span>
                    </p>
                  ) : result.status === 'Intruder' ? (
                    <p className="text-red-400">
                      <strong>Intruder Alert:</strong> Detected student: <span className="font-bold">{result.student}</span>
                    </p>
                  ) : (
                    <p className="text-green-300">All students accounted for.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </BackgroundLines>
    </>
  );
}
