"use client";

import Image from "next/image";
import Link from "next/link";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { Fragment, MouseEventHandler } from "react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";

import { useToggle } from "@/lib/hooks/useToggle";
import { useWindowSize } from "@/lib/hooks/useWindowSize";

import { NavLinkProps, navLinks } from "@/data/navLinks";

/**
 * Component for main header and navbar
 */
export function Header() {
  const [isOpen, toggleOpen] = useToggle(false);

  return (
    <header className="sm:flex sm:justify-between">
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
        <button
          className="sm:hidden cursor-pointer"
          onClick={toggleOpen}
          aria-label="Show Mobile Links"
        >
          <Bars3Icon className="size-10 fill-gray-800 dark:fill-gray-300 hover:fill-black focus:fill-black dark:hover:fill-white dark:focus:fill-white" />
        </button>
      </div>
      <nav className={`${isOpen || "hidden"} sm:flex sm:items-center`}>
        {navLinks.map((link) => (
          <NavbarLink key={link.title} {...link} onClick={toggleOpen} />
        ))}
      </nav>
      <div
        className={`${isOpen || "hidden"} sm:hidden lg:flex grow basis-0 justify-end items-center`}
      >
        <ThemeToggle className="hover:text-secondary cursor-pointer capitalize font-semibold mx-3" />
      </div>
    </header>
  );
}

/**
 * Styles for individual links in Navbar
 *
 * Export so that we can re-use these throughout the app.
 */
export const NavLinkStyles =
  "block hover:text-secondary-dark m-3 font-semibold text-gray-950 dark:text-gray-50 cursor-pointer";

/**
 * Styles for navBar dropdown menu. Re-used by theme toggle so export these
 */
export const NavDropdownStyle =
  "max-w-50 sm:-ml-3 sm:mt-2 bg-primarywhite-light dark:bg-stone-700 ring-1 ring-black rounded-lg shadow-md " +
  "transition data-[enter]:duration-250 data-[leave]:duration-20 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 ";

function NavbarLink({
  title,
  href,
  sublinks,
  onClick,
}: NavLinkProps & { onClick: MouseEventHandler }) {
  const windowSize = useWindowSize();

  const anchor =
    !windowSize || windowSize.width > 640 ? "bottom start" : undefined;
  if (sublinks) {
    return (
      <>
        <Menu>
          <MenuButton
            className={
              NavLinkStyles +
              " inline-flex items-start gap-1 data-open:border-b-1 data-open:border-primary"
            }
          >
            {title} <ChevronDownIcon className="size-5" />
          </MenuButton>
          <MenuItems transition anchor={anchor} className={NavDropdownStyle}>
            {sublinks.map(({ title, href }) => (
              <MenuItem key={href} as={Fragment}>
                {({ focus }) => (
                  <Link
                    href={href}
                    className={`group h-10 justify-between flex items-center cursor-pointer w-full text-md rounded-md px-3 py-2 
                    ${focus && "bg-secondary"}`}
                  >
                    {title}
                  </Link>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      </>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={NavLinkStyles}>
      {title}
    </Link>
  );
}
