import useQueryGetAllEvents from "@/hooks/useQueryGetAllEvents.hook";
import authAxios from "@/services/authAxios";
import { useReducer, useState, useEffect, useCallback } from "react";

const API_BASE_URL = (authAxios.defaults.baseURL || "").replace(/\/+$/, "");
const DEFAULT_LIMI_PER_PAGE: number = 10;

const initialState = {
  search: "",
  eventType: "", //  "All" | "Conference" | "Workshop" | "Meetup" | "Seminar" | "Webinar"
  page: 1,
  limit: 10,
  time: "latest",
};

type QueryType = typeof initialState;

const ACTION = {
  SET_QUERY: "SET_QUERY",
  SET_TYPE: "SET_TYPE",
  SET_PAGE: "SET_PAGE",
  INCREASE_PAGE: "INCREASE_PAGE",
  DECREASE_PAGE: "DECREASE_PAGE",
} as const;

type ActionType =
  | { type: "SET_QUERY"; payload: string }
  | { type: "SET_TYPE"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "INCREASE_PAGE" }
  | { type: "DECREASE_PAGE" };

function queryReducer(state: QueryType, action: ActionType) {
  switch (action?.type) {
    case ACTION.SET_QUERY:
      return { ...state, search: action?.payload || "", page: 1 };
    case ACTION.SET_TYPE:
      return { ...state, eventType: action?.payload || "", page: 1 };
    case ACTION.INCREASE_PAGE:
      return { ...state, page: state.page + 1 };
    case ACTION.DECREASE_PAGE:
      return { ...state, page: state.page - 1 };
    case ACTION.SET_PAGE:
      return { ...state, page: action?.payload || 1 };

    default:
      throw new Error("Action not recognized.");
  }
}

const useAllEvent = () => {
  const [query, queryDispatch] = useReducer(queryReducer, initialState);
  const [deferredSearch, setDeferredSearch] = useState<string>(
    query.search || ""
  );

  const getParams = useCallback(() => {
    const finalParams = new URLSearchParams({
      ...(query.page > 1 && { page: query.page.toString() }),
      ...(DEFAULT_LIMI_PER_PAGE !== 10 && {
        limit: DEFAULT_LIMI_PER_PAGE.toString(),
      }),
      ...(deferredSearch && { search: deferredSearch }),
      ...(query?.eventType && { type: query.eventType }),
    });

    return finalParams.toString();
  }, [query, deferredSearch]);

  const {
    data: publicEventData,
    isFetching: isFetchingPublicEvent,
    refetch: refetchPublicEvent,
  } = useQueryGetAllEvents({ queryParams: getParams() });

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
    const timerRef = setTimeout(() => {
      setDeferredSearch(query.search);
    }, 500);

    return () => clearTimeout(timerRef);
  }, [query.search]);

  //move screen to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
