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
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "@tanstack/react-router";

type SignupDialogProps = {
  isSignupOpen: boolean;
  setSignupOpen: Dispatch<SetStateAction<boolean>>;
  setLoginOpen: Dispatch<SetStateAction<boolean>>;
};

const schema = yup.object({
  name: yup.string().required("Name is required."),
  email: yup
    .string()
    .email("Invalid email. Enter valid email.")
    .required("Email is required."),
  password: yup
    .string()
    .required("Password is required.")
    .min(6, "Password must be at least 6 characters."),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type MutationData = Omit<FormData, "confirmPassword">;

const SignupDialog = ({
  isSignupOpen,
  setSignupOpen,
  setLoginOpen,
}: SignupDialogProps) => {
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

  const apiUrl = import.meta.env.VITE_BASE_URL;

  const { mutate: mutateForm, isPending: isPendingForm } = useMutation({
    mutationFn: (data: MutationData) =>
      axios.post(`${apiUrl}/signup`, data, { withCredentials: true }),
    onSuccess: () => {
      // handle success (e.g., show toast, redirect, etc.)
      handleDialogOnOpenChange(false);
      navigate({ to: "/dashboard" });
    },
    onError: (err: AxiosError<{ error?: { email?: string } }>) => {
      // handle error (e.g., show error message)
      const emailError = err.response?.data?.error?.email;
      if (emailError) {
        setError("email", { type: "server", message: emailError });
      }
      console.error(err);
    },
  });

  function onFinalSubmit(data: FormData) {
    const { confirmPassword, ...finalData } = data;

    console.log({ confirmPassword, finalData });

    mutateForm(finalData);
  }

  function handleDialogOnOpenChange(isOpen: boolean) {
    setSignupOpen(isOpen);
    if (!isOpen) reset();
  }

  return (
    <>
      {/* 
        The 'onOpenChange' prop on the <Dialog> component is a callback that gets called 
        whenever the dialog's open state changes (for example, when the dialog is opened or closed 
        by the user or programmatically). Here, 'handleDialogOnOpenChange' is used to 
        update the local state for 'isSignupOpen' and also resets the form when the dialog is closed.
      */}
      <Dialog open={isSignupOpen} onOpenChange={handleDialogOnOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create an account</DialogTitle>
            <DialogDescription>Sign up to get started</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit(onFinalSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-sm font-medium">
                Full name
              </Label>
              <Input
                id="signup-name"
                placeholder="John Doe"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                {...register("name")}
                disabled={isPendingForm}
              />
              {!!errors?.name?.message && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="signup-email"
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
              <Label htmlFor="signup-password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="signup-password"
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
            <div className="space-y-2">
              <Label htmlFor="re-password" className="text-sm font-medium">
                Re-enter Password
              </Label>
              <Input
                id="re-password"
                placeholder="••••••••"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                {...register("confirmPassword")}
                disabled={isPendingForm}
              />
              {!!errors?.confirmPassword?.message && (
                <p className="text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPendingForm}>
              {isPendingForm ? "Signing up..." : "Sign up"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              className="text-primary underline underline-offset-4"
              onClick={() => {
                handleDialogOnOpenChange(false);
                setLoginOpen(true);
              }}
            >
              Log in
            </button>
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignupDialog;
