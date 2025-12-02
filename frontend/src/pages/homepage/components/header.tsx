import { Button } from "@/components/ui/button";
import { Calendar, Moon, Sun } from "lucide-react";
import { useState } from "react";
import type { MouseEvent } from "react";
import LoginDailog from "@/components/auth/login-dailog";
import SignupDialog from "@/components/auth/signup-dailog";

interface HeaderProps {
  theme: "light" | "dark";
  onThemeToggle: () => void;
}

export default function Header({ theme, onThemeToggle }: HeaderProps) {
  const [isLoginOpen, setLoginOpen] = useState<boolean>(false);
  const [isSignupOpen, setSignupOpen] = useState<boolean>(false);

  const handleNavClick = (
    e: MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => handleNavClick(e, "features")}
              >
                Features
              </a>
              <a
                href="#about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => handleNavClick(e, "about")}
              >
                Browse Events
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => handleNavClick(e, "pricing")}
              >
                Pricing
              </a>
              <a
                href="#footer"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => handleNavClick(e, "footer")}
              >
                Footer
              </a>
            </nav>

            {/* Auth Buttons & Theme Toggle */}
            <div className="flex items-center gap-3">
              <Button
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
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => setLoginOpen(true)}
              >
                Log in
              </Button>
              <Button size="sm" onClick={() => setSignupOpen(true)}>
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </header>
      {/* Login dialog */}
      <LoginDailog
        isLoginOpen={isLoginOpen}
        setLoginOpen={setLoginOpen}
        setSignupOpen={setSignupOpen}
      />
      {/* Signup dialog */}
      <SignupDialog
        isSignupOpen={isSignupOpen}
        setSignupOpen={setSignupOpen}
        setLoginOpen={setLoginOpen}
      />
    </>
  );
}
