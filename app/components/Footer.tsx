import Image from "next/image";
import Link from "next/link";

import { footerLinks } from "@/app/components/ProjectData";

const Footer = () => (
  <footer className="flex flex-col text-black-100 dark:text-slate-300 mt-5 border-t border-gray-100 dark:border-slate-700">
    <div className="flex max-md:flex-col flex-wrap justify-between gap-5 sm:px-16 px-6 py-10">
      <div className="flex flex-col justify-start items-start gap-6">
        <Image
          src="/logo.svg"
          alt="logo"
          width={148}
          height={26}
          className="object-contain dark:invert"
        />
        <p className="text-base text-gray-700 dark:text-slate-400">
          KetoHub 2024 <br />
          All Rights Reserved &copy;
        </p>
      </div>

      <div className="footer__links">
        {footerLinks.map((item) => (
          <div key={item.title} className="footer__link">
            <h3 className="font-bold dark:text-slate-100">{item.title}</h3>
            <div className="flex flex-col gap-5">
              {item.links.map((link) => (
                <Link
                  key={link.title}
                  href={link.url}
                  className="text-gray-500 dark:text-slate-400 hover:text-primary-red transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="flex justify-between items-center flex-wrap mt-10 border-t border-gray-100 dark:border-slate-700 sm:px-16 px-6 py-10">
      <p className="dark:text-slate-400">@2023 KetoHub. All rights reserved</p>

      <div className="footer__copyrights-link">
        <Link href="/" className="text-gray-500 dark:text-slate-400">
          Privacy & Policy
        </Link>
        <Link href="/" className="text-gray-500 dark:text-slate-400">
          Terms & Condition
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
