"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { navLinks } from "./ProjectData";
import { ThemeToggle } from "./ThemeToggle";

interface NavLinks {
  name: string;
  link: string;
}

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = useCallback(
    (href: string) => {
      router.prefetch(href);
    },
    [router],
  );

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="w-full z-50 bg-white dark:bg-[#1e293b] border-b border-transparent dark:border-[#334155]">
      <nav className="flex justify-between items-center sm:px-16 px-6 py-4 max-w-[1440px] w-full mx-auto">
        {/* Logo */}
        <Link href="/" className="flex justify-center items-center">
          <Image
            src="/logo.svg"
            alt="logo"
            width={148}
            height={26}
            className="object-contain"
          />
        </Link>

        {/* Desktop Navigation — centered */}
        <ul className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          {navLinks.map((item: NavLinks) => (
            <li key={item.name}>
              <Link
                href={item.link}
                onMouseEnter={() => handleMouseEnter(item.link)}
                className={`text-[1rem] font-medium transition-colors duration-200 ${
                  pathname === item.link
                    ? "text-primary-red"
                    : "text-black dark:text-gray-200 hover:text-primary-red dark:hover:text-primary-red"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side — theme toggle + hamburger */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-[#1e293b] shadow-lg transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out z-50`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-[#334155]">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              Menu
            </span>
            <button
              className="text-gray-700 dark:text-gray-300 focus:outline-none"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
          <ul className="flex flex-col gap-1 p-4">
            {navLinks.map((item: NavLinks) => (
              <li key={item.name}>
                <Link
                  href={item.link}
                  className={`block px-3 py-2 rounded-lg text-[1rem] font-medium transition-colors duration-200 ${
                    pathname === item.link
                      ? "text-primary-red bg-primary-red-100 dark:bg-red-950"
                      : "text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={closeMenu}
            aria-hidden
          />
        )}
      </nav>
    </header>
  );
};

export default NavBar;
