
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MenuIcon, X, Search, MapPin, Bell, Calendar, BriefcaseIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const NavItem = ({ href, children, icon }: NavItemProps) => {
  return (
    <Link
      to={href}
      className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
                hover:bg-accent hover:text-accent-foreground group"
    >
      {icon && <span className="mr-2">{icon}</span>}
      <span className="relative overflow-hidden">
        <span className="block transition-transform duration-300 transform group-hover:-translate-y-full">
          {children}
        </span>
        <span className="absolute top-0 left-0 block transition-transform duration-300 transform translate-y-full group-hover:translate-y-0">
          {children}
        </span>
      </span>
    </Link>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-30 transition-all duration-300 ease-in-out py-3",
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-sm dark:bg-slate-900/80"
          : "bg-transparent"
      )}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center transition-transform duration-300 hover:scale-105"
          >
            <span className="text-xl font-bold tracking-tight text-primary">
              Abu<span className="text-accent">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavItem href="/" icon={<MapPin className="w-4 h-4" />}>
              Local Services
            </NavItem>
            <NavItem href="/" icon={<Bell className="w-4 h-4" />}>
              News
            </NavItem>
            <NavItem href="/" icon={<Calendar className="w-4 h-4" />}>
              Events
            </NavItem>
            <NavItem href="/" icon={<BriefcaseIcon className="w-4 h-4" />}>
              Jobs
            </NavItem>
          </nav>

          {/* Search and menu buttons */}
          <div className="flex items-center">
            <button
              className="p-2 ml-3 text-gray-500 rounded-full transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 ml-3 text-gray-500 rounded-full transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary md:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <MenuIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-x-0 top-[61px] z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg transition-[max-height] duration-300 ease-in-out overflow-hidden md:hidden",
          isMobileMenuOpen ? "max-h-screen" : "max-h-0"
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="flex items-center px-3 py-3 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150"
          >
            <MapPin className="w-5 h-5 mr-3 text-accent" />
            Local Services
          </Link>
          <Link
            to="/"
            className="flex items-center px-3 py-3 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150"
          >
            <Bell className="w-5 h-5 mr-3 text-accent" />
            News
          </Link>
          <Link
            to="/"
            className="flex items-center px-3 py-3 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150"
          >
            <Calendar className="w-5 h-5 mr-3 text-accent" />
            Events
          </Link>
          <Link
            to="/"
            className="flex items-center px-3 py-3 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150"
          >
            <BriefcaseIcon className="w-5 h-5 mr-3 text-accent" />
            Jobs
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
