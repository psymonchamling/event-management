import authAxios from "@/services/authAxios";
import { useQuery } from "@tanstack/react-query";
import { useReducer, useState, useEffect } from "react";

const DEFAULT_LIMI_PER_PAGE = 10;

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

type EventQueryParams = {
  time: string;
  search?: string;
  type?: string;
  page: number;
  limit: number;
};

const API_BASE_URL = (authAxios.defaults.baseURL || "").replace(/\/+$/, "");

const initialState = {
  search: "",
  eventType: "", //  "All" | "Conference" | "Workshop" | "Meetup" | "Seminar" | "Webinar"
  page: 1,
};

type QueryType = typeof initialState;
type ActionType = {
  type: string;
  payload?: string;
};

const ACTION = {
  CHANGE_SEARCH: "CHANGE_SEARCH",
  CHANGE_EVENTTYPE: "CHANGE_EVENTTYPE",
  INCREASE_PAGE: "INCREASE_PAGE",
  DECREASE_PAGE: "DECREASE_PAGE",
  CHANGE_PAGE: "CHANGE_PAGE",
};

function queryReducer(state: QueryType, action: ActionType) {
  switch (action.type) {
    case ACTION.CHANGE_SEARCH:
      return { ...state, search: action?.payload || "", page: 1 };
    case ACTION.CHANGE_EVENTTYPE:
      return { ...state, eventType: action?.payload || "", page: 1 };
    case ACTION.INCREASE_PAGE:
      return { ...state, page: state.page + 1 };
    case ACTION.DECREASE_PAGE:
      return { ...state, page: state.page - 1 };
    case ACTION.CHANGE_PAGE:
      return { ...state, page: parseInt(action?.payload || "1") };

    default:
      throw new Error("Action not recognized.");
  }
}

const useAllEvent = () => {
  const [query, queryDispatch] = useReducer(queryReducer, initialState);
  const [deferredSearch, setDeferredSearch] = useState<string>(
    query.search || ""
  );

  const {
    data: publicEventData,
    isFetching: isFetchingPublicEvent,
    refetch: refetchPublicEvent,
  } = useQuery<PublicEventListResponse>({
    queryKey: ["publicEvents"],
    queryFn: () =>
      authAxios<PublicEventListResponse>("/api/events", {
        params: getParams(),
      }).then((res) => res.data),
  });

  const eventList = publicEventData?.events;
  const {
    page: currentPage = 1,
    limit: perPageLimit = 10,
    total: totalEvents = 0,
    totalPages = 1,
  } = publicEventData?.pagination || {};
  const start = (currentPage - 1) * perPageLimit;
  const end = start + perPageLimit;

  //refetch all event list
  useEffect(() => {
    refetchPublicEvent();
  }, [refetchPublicEvent, deferredSearch, query.eventType, query.page]);

  //debouncing search
  useEffect(() => {
    const intervalRef = setTimeout(() => {
      setDeferredSearch(query.search);
    }, 500);

    return () => {
      clearTimeout(intervalRef);
    };
  }, [query.search]);

  //move screen to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  function getParams() {
    const finalParams: EventQueryParams = {
      time: "latest",
      page: query.page,
      limit: DEFAULT_LIMI_PER_PAGE,
    };
    if (deferredSearch) {
      finalParams.search = deferredSearch;
    }
    if (query.eventType) {
      finalParams.type = query.eventType;
    }

    return finalParams;
  }

  return {
    API_BASE_URL,
    ACTION,
    query,
    queryDispatch,
    isFetchingPublicEvent,
    eventList,
    currentPage,
    totalEvents,
    totalPages,
    start,
    end,
  };
};

export default useAllEvent;
