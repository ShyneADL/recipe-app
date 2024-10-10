"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Import usePathname hook

import CustomButton from "./CustomButton";
import { navLinks } from "./ProjectData";

interface NavLinks {
  name: string;
  link: string;
}

const NavBar = () => {
  const pathname = usePathname(); // Get the current pathname

  return (
    <header className="w-full flex items-center justify-center py-4">
      <nav className="flex justify-between items-center sm:px-16 px-6 py-4 bg-transparent max-w-[1440px] w-full">
        <Link href="/" className="flex justify-center items-center">
          <Image
            src="/logo.svg"
            alt="logo"
            width={148}
            height={26}
            className="object-contain"
          />
        </Link>

        <ul className="flex items-center gap-4">
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

        <div className="flex items-center gap-4">
          <CustomButton
            title="Log in"
            btnType="button"
            containerStyles="text-primary-red rounded-2xl bg-white min-w-[130px] border-solid border-[1px] border-primary-red"
          />
          <CustomButton
            title="Sign Up"
            btnType="button"
            containerStyles="text-white rounded-2xl bg-primary-red min-w-[130px]"
          />
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
