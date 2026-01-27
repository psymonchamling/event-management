import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import LoginDailog from "@/components/auth/login-dailog";
import SignupDialog from "@/components/auth/signup-dailog";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { NavUser } from "@/components/nav-user-header";
import { useAuth } from "@/context/auth-context/auth-context";
import { useLoginDailogContext } from "@/context/login-dialog-context/login-dialog-context";

interface HeaderProps {
  theme: "light" | "dark";
  onThemeToggle: () => void;
}

export default function Header({ theme, onThemeToggle }: HeaderProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { refetchUserData, isFetchingUserData, isLoggedIn } = useAuth();
  const { isLoginDialogOpen, setLoginDialogOpen } = useLoginDailogContext();

  const [isSignupOpen, setSignupOpen] = useState<boolean>(false);

  const isHomePage: boolean = pathname === "/";

  const handleLogoClick = () => {
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate({ to: "/" });
  };

  useEffect(() => {
    refetchUserData();
  }, [refetchUserData]);

  function handleHome(e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) {
    if (isHomePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-4 border">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleLogoClick}
              aria-label="Go to top"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                EventHub
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {/* The onClick handler is triggered before the router's navigation logic. 
                  Calling e.preventDefault() inside handleHome prevents the default 
                  navigation when already on the home page, allowing the smooth 
                  scroll behavior to take precedence. */}
              <Link
                to="/"
                onClick={handleHome}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>

              {isLoggedIn && (
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
              )}

              <Link
                to="/events"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Explore Event
              </Link>
              <Link
                to="/about-us"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/contact-us"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact Us
              </Link>
            </nav>

            {/* Auth Buttons & Theme Toggle */}
            {!isFetchingUserData && (
              <div className="flex items-center gap-3">
                {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={onThemeToggle}
                  className="h-9 w-9 p-0"
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </Button> */}
                {isLoggedIn ? (
                  <NavUser />
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden sm:inline-flex"
                      onClick={() => setLoginDialogOpen(true)}
                    >
                      Log in
                    </Button>
                    <Button size="sm" onClick={() => setSignupOpen(true)}>
                      Sign up
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Login dialog */}
      <LoginDailog
        isLoginOpen={isLoginDialogOpen}
        setLoginOpen={setLoginDialogOpen}
        setSignupOpen={setSignupOpen}
      />
      {/* Signup dialog */}
      <SignupDialog
        isSignupOpen={isSignupOpen}
        setSignupOpen={setSignupOpen}
        setLoginOpen={setLoginDialogOpen}
      />
    </>
  );
}
