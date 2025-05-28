"use client"
import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';

const page = () => {
    const router = useRouter();
    const { teachername } = useParams();
    console.log(teachername)
    const detectionItems = [
      { name: "Attendance Detection", href: `/admin/${teachername}/attendance` },
      { name: "Behaviour Detection", href: `/admin/${teachername}/BehaviourDetection` },
      { name: "Noise Detection", href: `/admin/${teachername}/NoiseDetection` },
      { name: "Resource Management Analysis", href: `/admin/${teachername}/Projector` },
      { name: "Fire Alarm", href: `/admin/${teachername}/FireDetection` },
    ];
  return (
    <div className="max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Detection Modules
      </h2>
      <ul className="space-y-3">
        {detectionItems.map((item) => (
          <li key={item.name}>
            <Link href={item.href} className="block px-6 py-3 rounded-md text-lg font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-blue-500 hover:text-white transition-all duration-200 ease-in-out shadow-md"
                onClick={() => router.push(item.href)}>
              
                
              
                {item.name}
              
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default page
