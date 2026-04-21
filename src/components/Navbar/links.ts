import type { Route } from "next";

export const LINKS: Array<{ label: string; href: Route }> = [
  { label: "Projects", href: "/#projects" as Route },
  { label: "About", href: "/about" as Route },
  { label: "Work with me", href: "/services" as Route },
  // { label: "Shop", href: "https://society6.com/beatricecox", target: "_blank" },
];
