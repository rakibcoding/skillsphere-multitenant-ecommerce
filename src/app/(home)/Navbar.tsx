"use client";
import Link from "next/link";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});
interface NavbarItemsProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}
const NavbarItems = ({ href, children, isActive }: NavbarItemsProps) => {
  return (
    <Button
      asChild
      variant="outline"
      className={cn(
        "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
        isActive && "bg-black text-white hover:bg-black hover:text-white"
      )}
    >
      <Link href={href} className="">
        {children}
      </Link>
    </Button>
  );
};
const NavbarItemsList = [
  { href: "/", children: "Home" },
  { href: "/about", children: "About" },
  { href: "/contact", children: "Contact" },
  { href: "/services", children: "Services" },
  { href: "/blog", children: "Blog" },
];

export const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="h-20 flex border-b justify-between font-medium bg-white">
      <Link href="/" className="pl-6 flex items-center">
        <span className={cn("text-5xl font-semibold ", poppins.className)}>
          Funroad
        </span>
      </Link>
      <div className="items-center gap-4 hidden lg:flex">
        {NavbarItemsList.map((item) => (
          <NavbarItems
            key={item.href}
            href={item.href}
            isActive={pathname === item.href}
          >
            {item.children}
          </NavbarItems>
        ))}
      </div>
      <div className="hidden lg:flex">
        <Button
          asChild
          variant="secondary"
          className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-white hover:bg-pink-400 transition-colors text-lg"
        >
          <Link href="/sign-in">Log in</Link>
        </Button>
        <Button
          asChild
          variant="secondary"
          className="border-l border-t-0 border-b-0 border-0 px-12 h-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black transition-colors text-lg"
        >
          <Link href="/sign-up"> Start Selling</Link>
        </Button>
      </div>
    </nav>
  );
};
