import { useState, type ReactNode } from "react";
import {
  LoginDialogContext,
  type LoginDialogContextValue,
} from "./login-dialog-context";

export type UserDetailResponse = {
  user: {
    _id: string;
    email: string;
  } | null;
};

export function LoginDialogContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isLoginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);

  const value: LoginDialogContextValue = {
    isLoginDialogOpen,
    setLoginDialogOpen,
  };

  return (
    <LoginDialogContext.Provider value={value}>
      {children}
    </LoginDialogContext.Provider>
  );
}
