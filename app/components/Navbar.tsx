"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CustomButton from "./CustomButton";
import { navLinks } from "./ProjectData";

interface NavLinks {
  name: string;
  link: string;
}

const NavBar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="w-full flex items-center justify-center py-4">
      <nav className="flex justify-between items-center sm:px-16 px-6 py-4 bg-transparent max-w-[1440px] w-full relative">
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
        <ul className="hidden md:flex items-center gap-4">
          {navLinks.map((item: NavLinks) => (
            <li key={item.name}>
              <Link
                href={item.link}
                className={`text-[1rem] font-medium ${
                  pathname === item.link ? "text-primary-red" : "text-black"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <CustomButton
              title="Log in/Sign up"
              btnType="button"
              containerStyles="text-black hover:text-primary-red transition ease duration-300 bg-white min-w-[130px] login-btn"
            />
          </Link>
        </div>

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
                  className={`text-[1rem] font-medium ${
                    pathname === item.link ? "text-primary-red" : "text-black"
                  }`}
                  onClick={toggleMenu}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/login" onClick={toggleMenu}>
                <p className="text-black text-[1rem] font-medium hover:text-primary-red transition ease duration-300 bg-white min-w-[130px] login-btn">
                  Log in/Sign up
                </p>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
