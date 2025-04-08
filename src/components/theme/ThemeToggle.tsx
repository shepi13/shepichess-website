"use client";

import Image from "next/image";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const SunSVG = () => (
  <Image alt="sun-icon" width={25} height={30} src="/icons/sun-1.svg" />
);

const MoonSVG = () => (
  <Image alt="moon-icon" width={25} height={25} src="/icons/moon-1.svg" />
);

const darkmodeOptions = [
  { img: SunSVG, text: "Light" },
  { img: MoonSVG, text: "Dark" },
];

/**
 * Theme Menu with options to choose between light and dark mode
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Menu>
      <MenuButton className={className} aria-label="Choose Theme">
        {resolvedTheme} Mode
      </MenuButton>
      <MenuItems
        anchor="bottom"
        transition
        className="bg-primarywhite-light dark:bg-primaryblack-light absolute right-0 w-32 ring-opacity-5 ring-1 ring-black rounded-lg shadow-md
                transition data-[enter]:duration-250 data-[leave]:duration-20 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 p-1"
      >
        {darkmodeOptions.map((option) => {
          const { img: Component } = option;
          return (
            <MenuItem key={option.text}>
              {({ focus }) => (
                <button
                  className={`group h-10 justify-between flex items-center cursor-pointer w-full text-md rounded-md px-3 py-2 
                                        ${focus && "bg-secondary-dark"}`}
                  onClick={() => {
                    setTheme(option.text.toLowerCase());
                  }}
                  aria-label={option.text}
                >
                  <div>
                    <Component />
                  </div>
                  <div className="mr-2">{option.text}</div>
                </button>
              )}
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
}
