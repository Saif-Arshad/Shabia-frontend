
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Menu, ChevronDown, User, LogOut, MessageCircle } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface NavItemProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NavItem = ({ to, children, className = "", onClick }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${isActive
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground"
        } ${className}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

const Header = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-border backdrop-blur-md bg-opacity-80">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/2.png" alt="" className="h-14 object-contain w-auto" />
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/community">Community</NavItem>
        </nav>

        {/* Auth Buttons or User Dropdown */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2"
                  role="button"
                  aria-expanded="false"
                >
                  <span>{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <Link to="/dashboard">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/dashboard/post">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Manage Posts</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <div className="flex flex-col h-full">
              <div className="space-y-6 flex-1">
                <h2 className="text-2xl font-bold tracking-tight">Menu</h2>
                <nav className="flex flex-col space-y-4">
                  <NavItem to="/" className="text-base py-2" onClick={() => setIsOpen(false)}>
                    Home
                  </NavItem>
                  <NavItem to="/local-services" className="text-base py-2" onClick={() => setIsOpen(false)}>
                    Services
                  </NavItem>
                  <NavItem to="/news" className="text-base py-2" onClick={() => setIsOpen(false)}>
                    News
                  </NavItem>
                  <NavItem to="/events" className="text-base py-2" onClick={() => setIsOpen(false)}>
                    Events
                  </NavItem>
                  <NavItem to="/jobs" className="text-base py-2" onClick={() => setIsOpen(false)}>
                    Jobs
                  </NavItem>
                  <NavItem to="/community" className="text-base py-2" onClick={() => setIsOpen(false)}>
                    Community
                  </NavItem>
                </nav>
              </div>

              <div className="border-t pt-4 pb-2">
                {user ? (
                  <div className="space-y-4">
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="secondary" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                      <Button variant="outline" className="w-full">
                        Log In
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="w-full">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
