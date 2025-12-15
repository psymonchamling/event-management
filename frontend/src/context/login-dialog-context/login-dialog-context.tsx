import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

export type LoginDialogContextValue = {
  isLoginDialogOpen: boolean;
  setLoginDialogOpen: Dispatch<SetStateAction<boolean>>;
};

export const LoginDialogContext = createContext<
  LoginDialogContextValue | undefined
>(undefined);

export function useLoginDailogContext() {
  const ctx = useContext(LoginDialogContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
