import authAxios from "@/services/authAxios";
import { useQuery } from "@tanstack/react-query";

type PublicEvent = {
  _id: string;
  title: string;
  type: string;
  dateTime?: string;
  location?: string;
  bannerUrl?: string;
};

type PublicEventListResponse = {
  events: PublicEvent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const useQueryGetAllEvents = ({
  queryParams = "",
  options = {},
}: {
  queryParams?: string;
  options?: Record<string, string>;
}) => {
  return useQuery<PublicEventListResponse>({
    queryKey: ["publicEvents"],
    queryFn: () =>
      authAxios<PublicEventListResponse>(
        `/api/events${queryParams ? `?${queryParams}` : ""}`
      ).then((res) => res.data),
    ...options,
  });
};

export default useQueryGetAllEvents;
