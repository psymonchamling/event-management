import authAxios from "@/services/authAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type PropsType = {
  userId: string;
  eventId: string;
  handleRegistrationSuccess?: () => void;
};

const useHandleRegistration = ({
  userId,
  eventId,
  handleRegistrationSuccess,
}: PropsType) => {
  const queryClient = useQueryClient();

  const {
    mutate: mutateRegistrationStatus,
    isPending: isPendingRegistrationStatus,
  } = useMutation({
    mutationFn: () =>
      authAxios.post("/api/registration", {
        userId,
        eventId,
      }),
    onSuccess: () => {
      handleRegistrationSuccess?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["userVerification", userId, eventId],
      });
    },
    onError: (err: AxiosError<{ errors?: { email?: string } }>) => {
      console.error(err);
    },
  });

  return {
    mutateRegistrationStatus,
    isPendingRegistrationStatus,
  };
};

export default useHandleRegistration;
