import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Loader2, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthStore } from "@/stores/authStore";
import { ModeToggle } from "./mode-toggle";

const STUDENT_ROUTES = ["/dashboard", "/rewards", "/tests"];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, logout } = useAuthStore((state) => state);
  const { pathname } = useLocation();

  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-background shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-brandPurple">TestBit</span>
        </Link>

        {isMobile ? (
          <>
          <div className="space-x-4 flex items-center">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

            {isMenuOpen && (
              <div className="absolute top-16 left-0 right-0 bg-background shadow-md z-50 py-4 px-4 animate-slide-up">
                <nav className="flex flex-col space-y-4">
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-brandPurple"
                    onClick={toggleMenu}
                  >
                    Home
                  </Link>
                  <Link
                    to="/tests"
                    className="text-muted-foreground hover:text-brandPurple"
                    onClick={toggleMenu}
                  >
                    Tests
                  </Link>
                  {STUDENT_ROUTES.includes(pathname) && (
                    <>
                      <Link
                        to="/dashboard"
                        className="text-muted-foreground hover:text-brandPurple"
                        onClick={toggleMenu}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/rewards"
                        className="text-muted-foreground hover:text-brandPurple"
                        onClick={toggleMenu}
                      >
                        Rewards
                      </Link>
                    </>
                  )}

                  <Link
                    to="/about"
                    className="text-muted-foreground hover:text-brandPurple"
                    onClick={toggleMenu}
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    className="text-muted-foreground hover:text-brandPurple"
                    onClick={toggleMenu}
                  >
                    Contact
                  </Link>

                  <div className="">
                    
                    {loading ? (
                      <Button className="w-full">
                        <Loader2 className="animate-spin" />
                      </Button>
                    ) : user ? (
                      <Button onClick={logout} className="w-full">
                        Logout
                      </Button>
                    ) : (
                      <Link to="/login">
                        <Button className="w-full">Login</Button>
                      </Link>
                    )}
                  </div>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center space-x-8">
            <nav className="flex space-x-6">
              {!STUDENT_ROUTES.includes(pathname) && (
                <>
                  <Link to="/" className="text-muted-foreground hover:text-brandPurple">
                    Home
                  </Link>
                  <Link
                    to="/tests"
                    className="text-muted-foreground hover:text-brandPurple"
                  >
                    Tests
                  </Link>
                  <Link
                    to="/about"
                    className="text-muted-foreground hover:text-brandPurple"
                  >
                    About
                  </Link>
                </>
              )}

              {STUDENT_ROUTES.includes(pathname) && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-muted-foreground hover:text-brandPurple"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/rewards"
                    className="text-muted-foreground hover:text-brandPurple"
                  >
                    Rewards
                  </Link>
                </>
              )}

              <Link
                to="/contact"
                className="text-muted-foreground hover:text-brandPurple"
              >
                Contact
              </Link>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <ModeToggle />
              {loading ? (
                <Button>
                  <Loader2 className="animate-spin" />
                </Button>
              ) : user ? (
                <Button onClick={logout}>Logout</Button>
              ) : (
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
