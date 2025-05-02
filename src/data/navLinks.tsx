/**
 * NavLink type
 *
 * @property title - link display title
 * @property href - link target
 * @property sublinks - dropdown links
 */
export type NavLinkProps = {
  title: string;
  href: string;
  sublinks?: Array<Omit<NavLinkProps, "sublinks">>;
};

/** Navigation links in header */
export const navLinks: Array<NavLinkProps> = [
  { href: "/coaching", title: "Coaching" },
  { href: "/study", title: "Chess Study" },
  { href: "/about", title: "About Us" },
  {
    href: "/board/analysis",
    title: "Tools",
    sublinks: [
      { href: "/board/analysis", title: "Analysis" },
      { href: "/board/computer", title: "Play Computer" },
    ],
  },
];
