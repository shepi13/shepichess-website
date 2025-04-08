/**
 * Hamburger button for use in a clickable menu
 *
 * @param props
 * @param props.onClick - Click handler that should be executed when button is clicked
 * @returns Button/SVG JSX for a clickable hamburger menu
 */
export function HamburgerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="sm:hidden text-gray-800 dark:text-gray-300 hover:text-black focus:text-black dark:hover:text-white dark:focus:text-white hover:cursor-pointer"
      onClick={onClick}
      aria-label="Show Mobile Links"
    >
      <svg className="h-10 w-10 fill-current" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
        />
      </svg>
    </button>
  );
}
