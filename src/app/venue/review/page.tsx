"use client";

import { useEffect } from "react";
import { getMyReviews } from "@/api/venue/review/api";

export default function ReviewPage() {
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getMyReviews({
          venueId: 1,
          page: 1,
          pageSize: 10,
        });

        console.log("FULL RESPONSE:", res);
        console.log("DATA:", res.data);
        console.log("SUMMARY:", res.data.summary);
        console.log("REVIEWS:", res.data.reviews.items);
      } catch (error) {
        console.error("Fetch reviews error:", error);
      }
    };

    fetchReviews();
  }, []);

  return <div>Review Page – check console</div>;
}
