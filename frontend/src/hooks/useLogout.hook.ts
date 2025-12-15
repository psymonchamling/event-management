import { useMutation } from "@tanstack/react-query";
import authAxios from "@/services/authAxios";
import type { AxiosError } from "axios";

const useLogout = () => {
  const { mutate: logout, isPending: isPendingLogout } = useMutation({
    mutationFn: () => authAxios.post("/logout", { withCredentials: true }),
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: (err: AxiosError<{ errors?: { email?: string } }>) => {
      console.error(err);
    },
  });

  return {
    logout,
    isPendingLogout,
  };
};

export default useLogout;
