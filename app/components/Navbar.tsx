"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CustomButton from "./CustomButton";
import { navLinks } from "./ProjectData";
import { getCurrentUser, logout } from "@/lib/appwrite";
import Loading from "../loading";

interface NavLinks {
  name: string;
  link: string;
}

interface User {
  name: string;
  email: string;
  avatar?: string;
}

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser({
            name: currentUser.name,
            email: currentUser.email,
            avatar: currentUser.avatar,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to get user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
      setShowDropdown(false);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <header className="w-full absolute z-10">
      <nav className="max-width padding-x py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex justify-center items-center">
            <Image
              src="/logo.svg"
              alt="KetoHub Logo"
              width={118}
              height={18}
              className="object-contain"
            />
          </Link>

          <ul className="hidden md:flex gap-6">
            {navLinks.map((item) => (
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
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-red text-white flex items-center justify-center text-lg font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-black font-medium">{user.name}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/wishlist"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <CustomButton
                  title="Log in/Sign up"
                  btnType="button"
                  containerStyles="text-black hover:text-primary-red transition ease duration-300 bg-white min-w-[130px] login-btn"
                />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
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
        </div>

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
            {navLinks.map((item) => (
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
            {user ? (
              <>
                <li className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary-red text-white flex items-center justify-center text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-black font-medium">{user.name}</span>
                  </div>
                  <Link
                    href="/wishlist"
                    className="block py-2 text-black hover:text-primary-red transition ease duration-300"
                    onClick={toggleMenu}
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="text-black text-[1rem] font-medium hover:text-primary-red transition ease duration-300"
                  >
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" onClick={toggleMenu}>
                  <p className="text-black text-[1rem] font-medium hover:text-primary-red transition ease duration-300">
                    Log in/Sign up
                  </p>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
