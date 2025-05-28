"use client"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
   
      <div>
         <BackgroundBeamsWithCollision>
        {children}
        </BackgroundBeamsWithCollision>
      </div>
    
  );
}