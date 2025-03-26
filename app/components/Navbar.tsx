"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import CustomButton from "./CustomButton";
import { navLinks } from "./ProjectData";

interface NavLinks {
  name: string;
  link: string;
}

interface User {
  name: string;
  email: string;
}

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = useCallback(
    (href: string) => {
      router.prefetch(href);
    },
    [router]
  );

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="w-full z-50 bg-white">
      <nav className="flex justify-between items-center sm:px-16 px-6 py-4 bg-transparent max-w-[1440px] w-full mx-auto">
        <Link href="/" className="flex justify-center items-center">
          <Image
            src="/logo.svg"
            alt="logo"
            width={148}
            height={26}
            className="object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          {navLinks.map((item: NavLinks) => (
            <li key={item.name}>
              <Link
                href={item.link}
                onMouseEnter={() => handleMouseEnter(item.link)}
                className={`text-[1rem] font-medium ${
                  pathname === item.link ? "text-primary-red" : "text-black"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger Menu Button */}
        <button
          className="md:hidden text-black focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Mobile Sidebar Navigation */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out z-50`}
        >
          <div className="p-4">
            <button
              className="text-black focus:outline-none"
              onClick={toggleMenu}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <ul className="flex flex-col gap-4 p-4">
            {navLinks.map((item: NavLinks) => (
              <li key={item.name}>
                <Link
                  href={item.link}
                  onMouseEnter={() => handleMouseEnter(item.link)}
                  className={`text-[1rem] font-medium ${
                    pathname === item.link ? "text-primary-red" : "text-black"
                  }`}
                  onClick={toggleMenu}
                >
                  {item.name}
                </Link>
              </li>
            ))}

            <div></div>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
