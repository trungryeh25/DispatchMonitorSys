"use client";

import { useEffect, useState } from "react";

export default function DashboardHomePage() {
  const icons = ["🍳", "🍽️", "🥘", "🥗", "🍔"];
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % icons.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold text-gray-800 mt-10">Dashboard Home</h1>
      <p className="text-gray-600 mt-1">
        <span className="ml-1 transition-all duration-500">
          {icons[currentIconIndex]}
        </span> {" "}
        This is an intelligent monitoring system for a commercial kitchen’s
        dispatch area.{" "}
        <span className="ml-1 transition-all duration-500">
          {icons[currentIconIndex]}
        </span>
      </p>
    </div>
  );
}
