import { Star } from "lucide-react";
import { useMemo, useState } from "react";

const reviews = [
  {
    id: 1,
    name: "Sara P.",
    rating: 5,
    date: "Jan 2026",
    comment:
      "Fantastic event! The sessions were insightful and very well organized.",
  },
  {
    id: 2,
    name: "Michael R.",
    rating: 4,
    date: "Jan 2026",
    comment:
      "Great speakers and content. Could use a bit more Q&A time though.",
  },
  {
    id: 3,
    name: "Priya K.",
    rating: 5,
    date: "Dec 2025",
    comment:
      "Loved the networking opportunities. Learned a lot and met amazing people.",
  },
];

const EventReviewSection = () => {
  const [newComment, setNewComment] = useState("");
  const [selectedRating, setSelectedRating] = useState(5);
  const [writeReview, setWriteReview] = useState<boolean>(false);

  const averageRating = useMemo(
    () =>
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0,
    [reviews]
  );

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
        {reviews.length > 0 && (
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

      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="group rounded-lg border border-border p-4 bg-background transition-colors hover:border-primary/20"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium text-foreground">{rev.name}</div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < rev.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted-foreground/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                {rev.date}
              </div>
              <p className="mt-2 text-sm text-foreground/80 leading-relaxed line-clamp-3">
                {rev.comment}
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

      {/* Write a review section */}
      {!writeReview ? (
        <button
          onClick={() => setWriteReview(true)}
          className="w-full rounded-lg border border-border bg-background py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary/50 active:scale-95"
        >
          Click to Write Review
        </button>
      ) : (
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
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[40px] w-full resize-none rounded-lg border border-border bg-background p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                className="flex min-h-[40px] w-[100px] flex-shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                disabled={!newComment.trim()}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventReviewSection;
