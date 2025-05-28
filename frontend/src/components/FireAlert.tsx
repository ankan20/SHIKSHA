// components/FireDetectionAlert.js
import { useEffect, useState } from 'react';

const FireDetectionAlert = ({ fireDetected }:{fireDetected:boolean}) => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Show alert if fire is detected
    if (fireDetected) {
      setShowAlert(true);
    }
  }, [fireDetected]);

  return (
    <>
      {showAlert && (
        <div className="fixed top-5 right-5 bg-red-600 text-white p-4 rounded shadow-lg transition-opacity duration-500 ease-out transform animate-bounce">
          🚨 Fire Detected!
        </div>
      )}
    </>
  );
};

export default FireDetectionAlert;
