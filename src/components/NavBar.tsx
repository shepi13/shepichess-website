"use client";

import Link from "next/link";
import navLinks from "@/data/navLinks";
import ThemeToggle from "./theme/ThemeToggle";
import Image from "next/image";
import useToggle from "@/lib/hooks/useToggle";

export default function NavBar() {
    const [isOpen, toggleOpen] = useToggle(false);

    return (
        <header className="sm:flex sm:justify-between p-5 lg:px-15">
            <div className="flex justify-between grow basis-0">
                <div className="h-14 md:h-20">
                    <Link href="/">
                        <Image
                            alt="shepichess"
                            src="/logo.svg"
                            width={422}
                            height={117}
                            className="h-full w-auto"
                        />
                    </Link>
                </div>
                <div>
                    <button
                        type="button"
                        className="sm:hidden text-gray-800 dark:text-gray-300 hover:text-black focus:text-black dark:hover:text-white dark:focus:text-white hover:cursor-pointer"
                        onClick={toggleOpen}
                        aria-label="Show Mobile Links"
                    >
                        <svg
                            className="h-10 w-10 fill-current"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <nav className={`${isOpen || "hidden"} sm:flex sm:items-center`}>
                {navLinks.map((link) => (
                    <Link
                        key={link.title}
                        href={link.href}
                        onClick={toggleOpen}
                        className="block hover:text-secondary-dark m-3 font-semibold text-gray-950 dark:text-gray-50"
                    >
                        {link.title}
                    </Link>
                ))}
            </nav>
            <div
                className={`${isOpen || "hidden"} sm:hidden lg:flex grow basis-0 justify-end`}
            >
                <ThemeToggle className="hover:text-secondary cursor-pointer capitalize font-semibold mx-3 mt-2 mb-10 lg:mb-3" />
            </div>
        </header>
    );
}
