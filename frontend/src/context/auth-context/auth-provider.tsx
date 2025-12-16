import type { ReactNode } from "react";
import { AuthContext, type AuthContextValue } from "./auth-context";
import authAxios from "@/services/authAxios";
import { useQuery } from "@tanstack/react-query";

export type UserDetailResponse = {
  user: {
    _id: string;
    email: string;
    name: string;
  } | null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    data: userData,
    isFetching: isFetchingUserData,
    refetch: refetchUserData,
  } = useQuery<UserDetailResponse>({
    queryFn: async () => {
      const res = await authAxios<UserDetailResponse>("/api/userdetail");
      return res.data;
    },
    queryKey: ["userDetail"],
    enabled: true,
    retry: false,
  });

  const value: AuthContextValue = {
    userData,
    isFetchingUserData,
    refetchUserData,
    isLoggedIn: !!userData?.user?._id,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
