import authAxios from "@/services/authAxios";
import { useQuery } from "@tanstack/react-query";

type UserDetailResponse = {
  user: {
    _id: string;
    email: string;
  } | null;
};

const useGetCurrentUser = () => {
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
    enabled: false,
  });

  return {
    userData,
    isFetchingUserData,
    refetchUserData,
    isLoggedIn: !!userData?.user?._id,
  };
};

export default useGetCurrentUser;
