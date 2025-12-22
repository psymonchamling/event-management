import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Route } from "@/routes/events/$eventId";
import authAxios from "@/services/authAxios";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useMemo, useState } from "react";
import EventReviewCommentSection from "./event-review-comment-section";

type ReviewType = {
  _id: string;
  eventId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
};

const EventReviewSection = ({ isCurrentUser }: { isCurrentUser: boolean }) => {
  const { eventId } = Route.useParams();
  const [writeReview, setWriteReview] = useState<boolean>(false);

  const {
    data: reviewData,
    isFetching: isFetchingReviewData,
    refetch: refetchReviews,
  } = useQuery({
    queryFn: () => authAxios(`/api/review/${eventId}`).then((res) => res.data),
    queryKey: ["reviews", eventId],
    enabled: Boolean(eventId),
  });

  const averageRating = useMemo(
    () =>
      reviewData?.length > 0
        ? reviewData.reduce((sum: number, r: ReviewType) => sum + r.rating, 0) /
          reviewData.length
        : 0,
    [reviewData]
  );

  function handleReviewSubmissionSuccess() {
    refetchReviews();
    setWriteReview(false);
  }

  return (
    <div className="mt-8 rounded-xl border border-border p-5 space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Customer Reviews
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Share your thoughts about this event
          </p>
        </div>
        {reviewData?.length > 0 && (
          <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-lg border border-border/50">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(averageRating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">
              {averageRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Write a review section */}
      {!isCurrentUser && (
        <>
          {!writeReview ? (
            <Button
              size="lg"
              className="w-full rounded-lg "
              onClick={() => setWriteReview(true)}
            >
              Write a review
            </Button>
          ) : (
            <EventReviewCommentSection
              handleReviewSubmissionSuccess={handleReviewSubmissionSuccess}
            />
          )}
        </>
      )}

      {/* Reviews list */}
      {isFetchingReviewData ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <ReviewSkeleton key={i} />
          ))}
        </div>
      ) : reviewData?.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {reviewData.map((review: ReviewType) => (
            <div
              key={review?._id}
              className="group rounded-lg border border-border p-4 bg-background transition-colors hover:border-primary/20"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium text-foreground">
                  {review?.reviewerName || "N/A"}
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < review.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted-foreground/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                {review?.createdAt}
              </div>
              <p className="mt-2 text-sm text-foreground/80 leading-relaxed line-clamp-3">
                {review?.review}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-border rounded-xl bg-secondary/5">
          <div className="rounded-full bg-secondary p-3 mb-3">
            <Star className="h-6 w-6 text-muted-foreground/30" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">
            No reviews yet
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            Be the first to share your experience!
          </p>
        </div>
      )}
    </div>
  );
};

export default EventReviewSection;

function ReviewSkeleton() {
  return (
    <div className="rounded-lg border border-border p-4 bg-background">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-3 rounded-full" />
          ))}
        </div>
      </div>
      <Skeleton className="mt-2 h-3 w-16" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}
