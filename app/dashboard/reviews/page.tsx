// app/dashboard/reviews/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ReviewsPage() {
  const params = useSearchParams();
  const locationName = params.get("location");

  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!locationName) return;

    fetch(`/api/google/reviews?location=${locationName}`)
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews || []));
  }, [locationName]);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">
        Reviews
      </h1>

      {reviews.map((review, index) => (
        <div key={index} className="bg-white p-6 mb-4 rounded-lg shadow">
          <p className="font-semibold">
            ⭐ {review.starRating}
          </p>

          <p className="mt-2">{review.comment}</p>

          <p className="text-sm text-gray-500 mt-2">
            {review.reviewer?.displayName}
          </p>
        </div>
      ))}
    </div>
  );
}