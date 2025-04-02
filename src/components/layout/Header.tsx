import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MenuIcon, X, Search, MapPin, Bell, Calendar, BriefcaseIcon, User } from "lucide-react";
import useAuth from "@/hooks/useUser";

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
  const { token,user} = useAuth()
  console.log("🚀 ~ Header ~ user:", user)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[1].charAt(0).toUpperCase()
    );
  };
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
              Shabia<span className="text-accent"></span>
            </span>
          </Link>

        
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
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {getInitials(user.name)}
                </div>
                <span className="capitalize">{user.name}</span>
              </div>
            ) : (
              <>
                <NavItem href="/register" icon={<User className="w-4 h-4" />}>
                  Register
                </NavItem>
                <NavItem href="/login" icon={<User className="w-4 h-4" />}>
                  Login
                </NavItem>
              </>
            )}
           

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
          <Link
            to="/login"
            className="flex items-center px-3 py-3 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150"
          >
            <User className="w-5 h-5 mr-3 text-accent" />
            Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
