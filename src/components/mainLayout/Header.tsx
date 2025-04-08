"use client";

import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme/ThemeToggle";

import { useToggle } from "@/lib/hooks/useToggle";

import { navLinks } from "@/data/navLinks";

import { HamburgerButton } from "./HamburgerButton";

/**
 * Component for main header and navbar
 */
export function Header() {
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
        <HamburgerButton onClick={toggleOpen} />
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
