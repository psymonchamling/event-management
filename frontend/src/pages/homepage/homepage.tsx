import { useState } from "react";
import Header from "./components/header";
import Hero from "./components/hero";
import Features from "./components/features";
import CTA from "./components/cta";
import Footer from "./components/footer";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const Homepage = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  return (
    <main className="min-h-screen bg-background">
      <Header
        theme={theme}
        onThemeToggle={toggleTheme}
        onOpenLogin={() => setLoginOpen(true)}
        onOpenSignup={() => setSignupOpen(true)}
      />

      {/* Login Dialog */}
      <AlertDialog open={loginOpen} onOpenChange={setLoginOpen}>
        <AlertDialogContent className="p-0 overflow-hidden">
          <div className="w-full max-w-sm space-y-6 p-6">
            <AlertDialogHeader>
              <AlertDialogTitle>Welcome back</AlertDialogTitle>
              <AlertDialogDescription>
                Sign in to your account
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label htmlFor="login-email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="login-password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                />
              </div>
              <Button type="submit" className="w-full">
                Log in
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <button
                type="button"
                className="text-primary underline underline-offset-4"
                onClick={() => {
                  setLoginOpen(false);
                  setSignupOpen(true);
                }}
              >
                Sign up
              </button>
            </p>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Signup Dialog */}
      <AlertDialog open={signupOpen} onOpenChange={setSignupOpen}>
        <AlertDialogContent className="p-0 overflow-hidden">
          <div className="w-full max-w-sm space-y-6 p-6">
            <AlertDialogHeader>
              <AlertDialogTitle>Create an account</AlertDialogTitle>
              <AlertDialogDescription>
                Sign up to get started
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label htmlFor="signup-name" className="text-sm font-medium">
                  Full name
                </label>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="signup-password"
                  className="text-sm font-medium"
                >
                  Password
                </label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                />
              </div>
              <Button type="submit" className="w-full">
                Sign up
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                className="text-primary underline underline-offset-4"
                onClick={() => {
                  setSignupOpen(false);
                  setLoginOpen(true);
                }}
              >
                Log in
              </button>
            </p>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Hero />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
};

export default Homepage;
