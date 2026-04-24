// "use client"

// import { useEffect, useState } from "react"
// import { getMyReviews } from "@/api/venue/review/api"
// import Statistic from "@/app/venue/review/component/Statistic"
// import Filter from "@/app/venue/review/component/Filter"
// import ReviewList from "@/app/venue/review/component/ReviewList"
// import { ReviewSummary, Review } from "@/api/venue/review/type"
// import Loading from "@/components/Loading"

// export default function ReviewPage() {
//   const [summary, setSummary] = useState<ReviewSummary | null>(null)
//   const [reviews, setReviews] = useState<Review[]>([])
//   const [loading, setLoading] = useState(true)
//   const [filterParams, setFilterParams] = useState({})

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true)

//       try {
//         const res = await getMyReviews({
//           venueId: 1,
//           page: 1,
//           pageSize: 10,
//           sortDescending: true,
//           ...filterParams,
//         })

//         setSummary(res.data.summary)
//         setReviews(res.data.reviews.items)
//       } catch (error) {
//         console.error(error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [filterParams])

//   if (loading && !summary) return <Loading />;

//   return (
//     <div className="p-6 space-y-6">
//       {summary && <Statistic summary={summary} />}

//       <Filter onChange={setFilterParams} />

//       <ReviewList
//         reviews={reviews}
//         isLoading={loading}
//       />
//     </div>
//   )
// }
