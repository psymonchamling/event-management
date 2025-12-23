import { useAuth } from "@/context/auth-context/auth-context";
import { Route } from "@/routes/events/$eventId";
import authAxios from "@/services/authAxios";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Star } from "lucide-react";
import { useState } from "react";

type PayloadType = {
  eventId: string;
  reviewerId: string;
  rating: number;
  review: string;
};

const EventReviewCommentSection = ({
  handleReviewSubmissionSuccess,
}: {
  handleReviewSubmissionSuccess: () => void;
}) => {
  const { eventId } = Route.useParams();
  const { userData } = useAuth();

  const reviewerId: string = userData?.user?._id || "";

  const [newComment, setNewComment] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);

  const { mutate: submitReivew, isPending: isPendingReviewSubmission } =
    useMutation({
      mutationFn: (data: PayloadType) => authAxios.post("api/review", data),
      onSuccess: async () => {
        handleReviewSubmissionSuccess();
      },
      onError: (err: AxiosError) => {
        console.error(err);
      },
    });

  function handleReviewSubmission() {
    if (!(eventId && reviewerId && newComment)) {
      return;
    }

    const finalPayload: PayloadType = {
      eventId,
      reviewerId,
      rating: selectedRating,
      review: newComment.trim(),
    };

    submitReivew(finalPayload);
  }

  return (
    <div className="group relative rounded-xl border border-border bg-secondary/10 p-4 transition-all hover:bg-secondary/20">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Write a review
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedRating(i + 1)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`h-4 w-4 ${
                    i < selectedRating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <textarea
            placeholder="Leave a comment..."
            className="min-h-[40px] w-full resize-none rounded-lg border border-border bg-background p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="flex min-h-[40px] w-[100px] flex-shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            onClick={() => handleReviewSubmission()}
            disabled={!newComment.length || isPendingReviewSubmission}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventReviewCommentSection;
