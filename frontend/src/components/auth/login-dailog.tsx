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
import { useNavigate } from "@tanstack/react-router";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type LoginDialogProps = {
  isLoginOpen: boolean;
  setLoginOpen: Dispatch<SetStateAction<boolean>>;
  setSignupOpen: Dispatch<SetStateAction<boolean>>;
};

const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email. Enter valid email.")
    .required("Email is required."),
  password: yup
    .string()
    .required("Password is required.")
    .min(6, "Password must be at least 6 characters."),
});

type FormData = {
  email: string;
  password: string;
};

const apiUrl = import.meta.env.VITE_BASE_URL;

const LoginDailog = ({
  isLoginOpen,
  setLoginOpen,
  setSignupOpen,
}: LoginDialogProps) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { mutate: mutateForm, isPending: isPendingForm } = useMutation({
    mutationFn: (data: FormData) =>
      axios.post(`${apiUrl}/login`, data, { withCredentials: true }),
    onSuccess: async () => {
      handleDialogOnOpenChange(false);
      navigate({ to: "/dashboard" });
    },
    onError: (err: AxiosError<{ errors?: { email?: string } }>) => {
      const emailError = err.response?.data?.errors?.email;
      if (emailError) {
        setError("email", { type: "server", message: emailError });
      }
      console.error(err);
    },
  });

  function onFinalSubmit(data: FormData) {
    mutateForm(data);
  }

  function handleDialogOnOpenChange(isOpen: boolean) {
    setLoginOpen(isOpen);
    if (!isOpen) reset();
  }

  return (
    <>
      <Dialog open={isLoginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Welcome Back</DialogTitle>
            <DialogDescription>Log in to your account</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit(onFinalSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="login-email"
                placeholder="you@example.com"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                {...register("email")}
                disabled={isPendingForm}
              />
              {!!errors?.email?.message && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="login-password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="login-password"
                placeholder="••••••••"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                {...register("password")}
                disabled={isPendingForm}
              />
              {!!errors?.password?.message && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPendingForm}>
              {isPendingForm ? "Logging in..." : "Log in"}
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
      </Dialog>
    </>
  );
};

export default LoginDailog;
