import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

import authAxios from "@/services/authAxios";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type DashboardSummary = {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalRegistrations: number;
  totalRevenue: number;
};

export function SectionCards() {
  const { data, isLoading } = useQuery<DashboardSummary>({
    queryKey: ["dashboardSummary"],
    queryFn: () =>
      authAxios.get("/api/events/summary/mine").then((res) => res.data),
  });

  const totalEvents = data?.totalEvents ?? 0;
  const upcomingEvents = data?.upcomingEvents ?? 0;
  const totalRegistrations = data?.totalRegistrations ?? 0;
  const totalRevenue = data?.totalRevenue ?? 0;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              formatCurrency(totalRevenue)
            )}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +0%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Revenue from your events
          </div>
          <div className="text-muted-foreground">
            Based on ticket price × attendees
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Events Created</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? <Skeleton className="h-7 w-16" /> : totalEvents}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -0%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            All events you have created
          </div>
          <div className="text-muted-foreground">
            Includes upcoming and past events
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Registrations</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? <Skeleton className="h-7 w-20" /> : totalRegistrations}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +0%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Attendees across all events
          </div>
          <div className="text-muted-foreground">
            Sum of current registrations
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Upcoming Events</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? <Skeleton className="h-7 w-10" /> : upcomingEvents}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +0
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Events still open or in the future
          </div>
          <div className="text-muted-foreground">
            Helps you track what&apos;s next
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
