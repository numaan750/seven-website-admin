"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/component/navbar/navbar";
import Home from "@/component/home/Home";
import Aboutus from "@/component/aboutus/Aboutus";
import Componies from "@/component/componies/Componies";
import Servies from "@/component/servies/Servies";
import Worksection from "@/component/worksection/Worksection";
import Joinus from "@/component/joinus/Joinus";
import Blogs from "@/component/blogs/Blogs";
import Footer from "@/component/footer/Footer";
import Reviews from "@/component/reviews/Reviews";
import User from "@/component/user/User";

import { Appcontext } from "@/context/Appcontext";
import { useRouter } from "next/navigation";

export default function SimpleSidebarLayout() {
  const [open, setopen] = useState(true);
  const { token, user, logout } = useContext(Appcontext);

  let searchParams;
if (typeof window !== "undefined") {
  searchParams = new URLSearchParams(window.location.search);
}
const defaultView = searchParams?.get("activeView") || "Navbar"; // default Navbar

  const [activeView, setActiveView] = useState(defaultView);

  const router = useRouter();

  const handlelogout = async () => {
    await logout();
    alert("Logout successfully!");
    router.push("/login");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localToken = localStorage.getItem("token");
      if (!localToken) {
        router.push("/login");
      }
    }
  }, [token]);

  useEffect(() => {
    console.log("Token in layout:", token);
  }, [token]);

  return (
    <div className="h-screen flex bg-gray-50 font-sans">
      <aside className="w-72 bg-white shadow-lg p-6 flex flex-col">
        <div className="flex items-center">
          <div className="h-20 w-20 relative">
            <Image
              src="/logo-black.png"
              alt="Logo"
              className="object-contain"
              fill
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2">
            <button
              onClick={() => setActiveView("Navbar")}
              className={`flex items-start gap-3 text-gray-600 hover:bg-gray-100 p-2 rounded-lg w-full text-left ${
                activeView === "Navbar" ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {open && <span>Navbar</span>}
            </button>

            <button
              onClick={() => setActiveView("Home")}
              className={`flex items-start gap-3 text-gray-600 hover:bg-gray-100 p-2 rounded-lg w-full text-left ${
                activeView === "Profile" ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {open && <span>Home</span>}
            </button>

            <button
              onClick={() => setActiveView("About us")}
              className={`flex items-start gap-3 text-gray-600 hover:bg-gray-100 p-2 rounded-lg w-full text-left ${
                activeView === "Messages" ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {open && <span>About us</span>}
            </button>

            <button
              onClick={() => setActiveView("Componies")}
              className={`flex items-start gap-3 text-gray-600 hover:bg-gray-100 p-2 rounded-lg w-full text-left ${
                activeView === "Projects" ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {open && <span>Componies</span>}
            </button>

            <button
              onClick={() => setActiveView("Servies")}
              className={`flex items-start gap-3 text-gray-600 hover:bg-gray-100 p-2 rounded-lg w-full text-left ${
                activeView === "Calendar" ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {open && <span>Servies</span>}
            </button>

            <button
              onClick={() => setActiveView("Worksection")}
              className={`flex items-start gap-3 text-gray-600 hover:bg-gray-100 p-2 rounded-lg w-full text-left ${
                activeView === "Reports" ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {open && <span>Worksection</span>}
            </button>

            <button
              onClick={() => setActiveView("Joinus")}
              className={`flex items-start gap-3 text-gray-600 hover:bg-gray-100 p-2 rounded-lg w-full text-left ${
                activeView === "Settings" ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {open && <span>Joinus</span>}
            </button>

            <button
              onClick={() => setActiveView("Reviews")}
              className={`flex items-start gap-3 text-gray-600 hover:bg-gray-100 p-2 rounded-lg w-full text-left ${
                activeView === "Billing" ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {open && <span>Reviews</span>}
            </button>

            <button
              onClick={() => setActiveView("Blogs")}
              className={`flex items-start gap-3 text-gray-600 hover:bg-gray-100 p-2 rounded-lg w-full text-left ${
                activeView === "Help" ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {open && <span>Blogs</span>}
            </button>

            <button
              onClick={() => setActiveView("Footer")}
              className={`flex items-start gap-3 text-gray-600 hover:bg-gray-100 p-2 rounded-lg w-full text-left ${
                activeView === "Help" ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {open && <span>Footer</span>}
            </button>
          </ul>
        </nav>

        <div className="mt-6">
          <button
            onClick={handlelogout}
            className="w-full py-2 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {activeView === "Navbar" && (
        <>
          <Navbar />
        </>
      )}
      {activeView === "Home" && (
        <>
          <Home />
        </>
      )}
      {activeView === "About us" && (
        <>
          <Aboutus />
        </>
      )}
      {activeView === "Componies" && (
        <>
          <Componies />
        </>
      )}
      {activeView === "Servies" && (
        <>
          <Servies />
        </>
      )}
      {activeView === "Worksection" && (
        <>
          <Worksection />
        </>
      )}
      {activeView === "Joinus" && (
        <>
          <Joinus />
        </>
      )}
      {activeView === "Reviews" && (
        <>
          <Reviews />
        </>
      )}

      {activeView === "Blogs" && (
        <>
          <Blogs />
        </>
      )}
      {activeView === "Footer" && (
        <>
          <Footer />
        </>
      )}
    </div>
  );
}
