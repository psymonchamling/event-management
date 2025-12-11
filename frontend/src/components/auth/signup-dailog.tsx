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
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
    .min(5, "Password must be at least 5 characters."),
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

const SignupDialog = ({
  isSignupOpen,
  setSignupOpen,
  setLoginOpen,
}: SignupDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      // Replace the URL and data as needed for your app
      return axios.post("/api/signup");
      // if (!response.ok) {
      //   throw new Error("Failed to signup");
      // }
      // return response.json();
    },
    // onSuccess: (data) => {
    //   // handle success (e.g., show toast, redirect, etc.)
    // },
    // onError: (error) => {
    //   // handle error (e.g., show error message)
    // },
  });

  function onFinalSubmit(data: FormData) {
    const { confirmPassword, ...finalData } = data;
    
    console.log({ confirmPassword, finalData });

    // mutation.mutate({ email: email!, password });
  }

  return (
    <>
      <Dialog open={isSignupOpen} onOpenChange={setSignupOpen}>
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
              />
              {!!errors?.confirmPassword?.message && (
                <p className="text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignupDialog;
