"use client";

import Link from "next/link";
import { Home, ImageIcon, Video, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: <Home size={32} />, name: "Home" },
    { href: "/dashboard/image", icon: <ImageIcon size={32} />, name: "Image" },
    { href: "/dashboard/video", icon: <Video size={32} />, name: "Video" },
    {
      href: "/dashboard/feedback",
      icon: <MessageSquare size={32} />,
      name: "Feedback",
    },
  ];

  return (
    <aside className="flex flex-col items-center w-full h-full bg-[#3399FF]">
      <label className="font-roboto font-bold ml-4 border-b border-white">
        <a href="/">BRAND</a>
      </label>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center text-gray-400 mt-6 hover:text-blue-200 transition-colors ${
              isActive ? "text-blue-200" : ""
            }`}
          >
            <span
              className={`p-1 border border-transparent ${
                isActive ? "animate-border-draw" : ""
              }`}
            >
              {item.icon}
            </span>
          </Link>
        );
      })}
    </aside>
  );
}
