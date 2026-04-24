// "use client"

// import { useState } from "react"
// import { Review, ReviewReply } from "@/api/venue/review/type"
// import { replyReview } from "@/api/venue/review/api"

// type Props = {
//   review: Review
//   isOwner?: boolean
//   onReplySuccess: (reviewId: number, reply: ReviewReply) => void
// }

// export default function ReviewCard({
//   review,
//   isOwner,
//   onReplySuccess,
// }: Props) {
//   const [showReplyForm, setShowReplyForm] = useState(false)
//   const [content, setContent] = useState("")
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async () => {
//     if (!content.trim()) return

//     try {
//       setLoading(true)

//       const res = await replyReview(review.id, {
//         content,
//       })

//       onReplySuccess(review.id, res.data)

//       setShowReplyForm(false)
//       setContent("")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
//       {/* Review content */}
//       <p className="text-sm">{review.content}</p>

//       {/* Owner Reply */}
//       {review.reviewReply && (
//         <div className="bg-gray-50 p-4 rounded-xl">
//           <p className="text-xs font-semibold text-gray-500 mb-1">
//             Chủ địa điểm
//           </p>
//           <p className="text-sm text-gray-800">
//             {review.reviewReply.content}
//           </p>
//         </div>
//       )}

//       {/* Reply button */}
//       {isOwner && !review.reviewReply && (
//         <>
//           {!showReplyForm ? (
//             <button
//               onClick={() => setShowReplyForm(true)}
//               className="text-sm text-blue-600 hover:underline"
//             >
//               Trả lời
//             </button>
//           ) : (
//             <div className="space-y-2">
//               <textarea
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 rows={3}
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
//                 placeholder="Nhập phản hồi của bạn..."
//               />

//               <div className="flex gap-2">
//                 <button
//                   onClick={handleSubmit}
//                   disabled={loading}
//                   className="px-4 py-1.5 bg-black text-white text-sm rounded-xl"
//                 >
//                   {loading ? "Đang gửi..." : "Gửi"}
//                 </button>

//                 <button
//                   onClick={() => setShowReplyForm(false)}
//                   className="px-4 py-1.5 bg-gray-100 text-sm rounded-xl"
//                 >
//                   Hủy
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   )
// }
