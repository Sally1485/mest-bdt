"use client";
import React, { useState } from "react";
import { Menu, X, Briefcase } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { apiFetcher } from "@/utils/api";
import { ThemeToggle } from "../core/ThemeToggle";
import HankoLogout from "../auth/HankoLogout";
import NoSSR from "../core/NoSSR";


// Define the type for a navigation link item
interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  // { name: "Account", href: "/account" },
  { name: "Company", href: "/user/company" },

];

const Navbar: React.FC = () => {
  const { data } = useSWR("/forms", apiFetcher);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-card border-b border-border shadow-sm fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Branding Area */}
          <div className="shrink-0">
            <Link
              href="/user"
              className="text-foreground text-xl font-bold flex items-center gap-2 group"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="tracking-tight">MEST BDT</span>
            </Link>
          </div>

          {/* Desktop Navigation Links (Hidden on small screens) */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-baseline space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground/70 hover:bg-foreground/5 hover:text-foreground px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                >
                  {item.name}
                </Link>
              ))}
              {data?.map((item: { name: string; id: string }) => (
                <Link
                  key={item.id}
                  href={`/user/form?id=${item.id}`}
                  className="text-foreground/70 hover:bg-foreground/5 hover:text-foreground px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                >
                  {item.name}
                </Link>
              ))}
              {/* Responses Link */}
              <Link
                href="/user/responses"
                className="text-foreground/70 hover:bg-foreground/5 hover:text-foreground px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              >
               My Inputs
              </Link>
            </div>
            <div className="pl-4 border-l border-border flex items-center gap-4">
              <ThemeToggle />
              <NoSSR>
                <HankoLogout />
              </NoSSR>
            </div>
          </div>

          {/* Mobile Menu Button (Hidden on desktop) */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/5 focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content (Toggled based on 'isOpen' state) */}
      <div
        className={`md:hidden ${isOpen ? "block" : "hidden"}`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t border-border shadow-inner">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-foreground/70 hover:bg-foreground/5 hover:text-foreground block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200"
              onClick={() => setIsOpen(false)} // Close menu when item is clicked
            >
              {item.name}
            </Link>
          ))}
          {data?.map((item: { name: string; id: string }) => (
            <Link
              key={item.id}
              href={`/user/form?id=${item.id}`}
              className="text-foreground/70 hover:bg-foreground/5 hover:text-foreground block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/user/responses"
            className="text-foreground/70 hover:bg-foreground/5 hover:text-foreground block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200"
            onClick={() => setIsOpen(false)}
          >
           My Responses
          </Link>
          <div className="pt-4 border-t border-border mt-4">
            <NoSSR>
              <HankoLogout />
            </NoSSR>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
