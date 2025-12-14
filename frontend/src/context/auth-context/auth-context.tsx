// frontend/src/context/auth-context.tsx
import { createContext, useContext } from "react";
import type { UserDetailResponse } from "./auth-provider";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";

export type AuthContextValue = {
  userData: UserDetailResponse | undefined;
  isFetchingUserData: boolean;
  refetchUserData: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<UserDetailResponse, Error>>;
  isLoggedIn: boolean;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
