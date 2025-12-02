import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";

type LoginDialogProps = {
  isLoginOpen: boolean;
  setLoginOpen: Dispatch<SetStateAction<boolean>>;
  setSignupOpen: Dispatch<SetStateAction<boolean>>;
};

const LoginDailog = ({
  isLoginOpen,
  setLoginOpen,
  setSignupOpen,
}: LoginDialogProps) => {
  return (
    <>
      <Dialog open={isLoginOpen} onOpenChange={setLoginOpen}>
        <form>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Welcome Back</DialogTitle>
              <DialogDescription>Sign in to your account</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
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
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export default LoginDailog;
