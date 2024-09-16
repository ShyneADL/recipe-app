import Link from "next/link";
import Image from "next/image";

import CustomButton from "./CustomButton";
import { navLinks } from "./ProjectData";

interface NavLinks {
  name: string;
  link: string;
}
const NavBar = () => (
  <header className=" w-full flex items-center justify-center">
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
            <a className="text-[1rem] text-black font-medium " href={item.link}>
              {item.name}
            </a>
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

export default NavBar;
