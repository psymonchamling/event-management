import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_URL;

type UserResponse = {
  _id: string;
  email: string;
  name: string;
} | null;

const useGetUserById = ({
  id,
  enabled = false,
}: {
  id: string;
  enabled: boolean;
}) => {
  const {
    data: user,
    isFetching: isFetchingUser,
    refetch: refetchUser,
  } = useQuery<UserResponse>({
    queryFn: () =>
      axios(`${apiUrl}/api/users/${id}`).then((data) => data?.data?.user),
    queryKey: ["user", id],
    enabled: Boolean(id && enabled),
  });

  return {
    user,
    isFetchingUser,
    refetchUser,
  };
};

export default useGetUserById;
