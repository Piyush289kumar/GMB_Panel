// app/dashboard/reviews/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ReviewsPage() {
  const params = useSearchParams();
  const locationName = params.get("location");

  const [reviews, setReviews] = useState<any[]>([]);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [loadingReview, setLoadingReview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = () => {
    if (!locationName) return;
    fetch(`/api/google/reviews?location=${locationName}`)
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews || []));
  };

  useEffect(() => {
    fetchReviews();
  }, [locationName]);

  const handleReply = async (reviewName: string) => {
    const comment = replyText[reviewName]?.trim();

    if (!comment) {
      setError("Reply cannot be empty.");
      return;
    }

    if (comment.length > 4096) {
      setError("Reply exceeds 4096 character limit.");
      return;
    }

    setError(null);
    setLoadingReview(reviewName);

    await fetch("/api/google/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewName, comment }),
    });

    setLoadingReview(null);
    fetchReviews();
  };

  const handleDelete = async (reviewName: string) => {
    setLoadingReview(reviewName);

    await fetch("/api/google/delete-reply", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewName }),
    });

    setLoadingReview(null);
    fetchReviews();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-zinc-900">
        Reviews
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {reviews.map((review) => (
          <div
            key={review.name}
            className="bg-white rounded-xl shadow p-5 md:p-6"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-lg">
                ⭐ {review.starRating}
              </p>
              <span className="text-sm text-gray-500">
                {review.reviewer?.displayName}
              </span>
            </div>

            <p className="mt-3 text-gray-800">{review.comment}</p>

            {/* Existing Reply */}
            {review.reviewReply?.comment && (
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm">Your Reply:</p>
                  <button
                    onClick={() => handleDelete(review.name)}
                    className="text-red-500 text-sm"
                    disabled={loadingReview === review.name}
                  >
                    Delete
                  </button>
                </div>
                <p className="mt-1 text-sm">
                  {review.reviewReply.comment}
                </p>
              </div>
            )}

            {/* Reply Box */}
            <div className="mt-4">
              <textarea
                className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none"
                rows={3}
                maxLength={4096}
                placeholder="Write a reply..."
                value={
                  replyText[review.name] ??
                  review.reviewReply?.comment ??
                  ""
                }
                onChange={(e) =>
                  setReplyText({
                    ...replyText,
                    [review.name]: e.target.value,
                  })
                }
              />

              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {(replyText[review.name]?.length || 0)}/4096
                </span>

                <button
                  onClick={() => handleReply(review.name)}
                  disabled={loadingReview === review.name}
                  className="bg-black text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                >
                  {loadingReview === review.name
                    ? "Saving..."
                    : review.reviewReply
                    ? "Update Reply"
                    : "Submit Reply"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}