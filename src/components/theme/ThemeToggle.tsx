"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon, MoonIcon, SunIcon } from "@heroicons/react/16/solid";
import { useTheme } from "next-themes";
import { Fragment, useEffect, useState } from "react";

import { useWindowSize } from "@/lib/hooks/useWindowSize";

import { NavDropdownStyle } from "../mainLayout/Header";

const SunSVG = () => (
  <SunIcon className="size-6 fill-yellow-300 stroke-[1px] stroke-primaryblack-light dark:fill-yellow-200 dark:stroke-none" />
);

const MoonSVG = () => (
  <MoonIcon className="size-6 fill-primaryblack-light dark:fill-primarywhite-dark" />
);

const darkmodeOptions = [
  { img: SunSVG, text: "Light" },
  { img: MoonSVG, text: "Dark" },
];

/**
 * Theme Menu with options to choose between light and dark mode
 *
 * @param props
 * @param props.className - styles to use for the main menu button.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const windowSize = useWindowSize();

  const anchor =
    !windowSize || windowSize.width > 640 ? "bottom start" : undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Menu>
      <MenuButton
        className={
          className +
          " inline-flex items-center gap-1 data-open:border-primary data-open:border-b-1"
        }
        aria-label="Choose Theme"
      >
        {resolvedTheme} Mode
        <ChevronDownIcon className="size-5" />
      </MenuButton>
      <MenuItems
        anchor={anchor}
        transition
        className={NavDropdownStyle + " w-32"}
      >
        {darkmodeOptions.map((option) => {
          const { img: Component } = option;
          return (
            <MenuItem key={option.text} as={Fragment}>
              {({ focus }) => (
                <button
                  className={`group h-10 justify-between flex items-center cursor-pointer w-full text-md rounded-md px-3 py-2
                              ${focus && "bg-secondary"}`}
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
