import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from '../../public/logo-removebg-preview.png'
import Image from "next/image"; 

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [user, setUser] = useState<{
    id: string;
    username: string;
    role: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data from localStorage
    setUser(null); // Clear user state
    router.push("/login"); // Redirect to the login page
  };

  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      
      <Menu setActive={setActive} >
      <Image src={Logo} alt="Logo" width={80}   className="md:-mt-7 md:mr-3 md:-mb-7"/>
        <Link href={"/"}>
          <MenuItem
            setActive={setActive}
            active={active}
            item="Home"
          ></MenuItem>
        </Link>

        {user ? (
          <>
            {/* Render items based on the user's role */}
            {user.role === "student" && (
              <Link href="/student">
                <MenuItem
                  setActive={setActive}
                  active={active}
                  item="Dashboard"
                ></MenuItem>
              </Link>
            )}
            {user.role === "student" && (
              <Link href="/student/chat">
                <MenuItem
                  setActive={setActive}
                  active={active}
                  item="Chat"
                ></MenuItem>
              </Link>
            )}
            {user.role === "teacher" && (
              
                <MenuItem
                  setActive={setActive}
                  active={active}
                  item="Dashboard"
                  
                >
                  <div className="flex flex-col space-y-4 text-sm z-50">
            <HoveredLink href="/teacher">Dashboard</HoveredLink>
            <HoveredLink href="/teacher/exam-qr-scan">Scan QR for Exam</HoveredLink>
            <HoveredLink href="/teacher/scan-barcode">Scan QR for student details</HoveredLink>
            <HoveredLink href="/teacher/seat-verification">Seat matrix verification</HoveredLink>
          </div>
                </MenuItem>
              
            )}
            {user.role === "teacher" && (
              <Link href="/teacher/add-student">
                <MenuItem
                  setActive={setActive}
                  active={active}
                  item="Add Student"
                ></MenuItem>
              </Link>
            )}
            {user.role === "admin" && (
              
                <MenuItem
                  setActive={setActive}
                  active={active}
                  item="Dashboard"
                >
                   <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/admin">All Teacher Info</HoveredLink>
            <HoveredLink href="/admin/get-barcode">Make QR Code</HoveredLink>
          </div>
                </MenuItem>
              
            )}

            {user.role === "admin" && (
                <MenuItem
                  setActive={setActive}
                  active={active}
                  item="Add"
                >
                <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/admin/add-teacher">Teacher</HoveredLink>
            <HoveredLink href="/admin/add-student">Student Info</HoveredLink>
          </div>
          </MenuItem>
              
            )}

            {/* Logout option */}
            <div onClick={handleLogout} className="cursor-pointer">Logout</div>
            <div className="text-blue-300">Hello ,{user.username} 👋</div>
          </>
        ) : (
          // Show login option if no user is logged in
          <Link href="/login">
            <MenuItem
              setActive={setActive}
              active={active}
              item="Login"
            ></MenuItem>
          </Link>
        )}
      </Menu>
    </div>
  );
}

export default Navbar;
