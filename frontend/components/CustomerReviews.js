import { IoIosStar, IoIosStarOutline } from "react-icons/io";

// const CustomerReviews = ({ reviews }) => {
//   const averageRating =
//     reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

//   return (
//     <div className="mt-10 w-full border-t border-gray-200 pt-8">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">
//         Customer Reviews & Ratings
//       </h2>

//       {/* Rating Summary */}
//       <div className="flex flex-col sm:flex-row gap-6 sm:items-center mb-6">
//         <div className="flex items-center gap-3">
//           <span className="text-4xl font-semibold text-green-600">
//             {averageRating.toFixed(1)}
//           </span>
//           <div className="flex text-yellow-500 text-xl">
//             {Array(5)
//               .fill(0)
//               .map((_, i) =>
//                 i < Math.round(averageRating) ? (
//                   <IoIosStar key={i} />
//                 ) : (
//                   <IoIosStarOutline key={i} />
//                 )
//               )}
//           </div>
//           <span className="text-gray-600 text-sm">
//             ({reviews.length} Reviews)
//           </span>
//         </div>
//       </div>

//       {/* Reviews List */}
//       <div className="space-y-5 pb-15">
//         {reviews.map((review) => (
//           <div
//             key={review.id}
//             className="bg-gray-50 border rounded-lg p-4 shadow-sm"
//           >
//             <div className="flex justify-between items-center">
//               <p className="font-medium text-gray-800">{review.name}</p>
//               <div className="flex text-yellow-500 text-lg">
//                 {Array(5)
//                   .fill(0)
//                   .map((_, i) =>
//                     i < review.rating ? (
//                       <IoIosStar key={i} />
//                     ) : (
//                       <IoIosStarOutline key={i} />
//                     )
//                   )}
//               </div>
//             </div>
//             <p className="text-gray-500 text-sm">{review.date}</p>
//             <p className="mt-2 text-gray-700">{review.comment}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
// export default CustomerReviews;


// components/CustomerReviews.js
import CustomerReviewCard from "./CustomerReviewCard";
import Link from "next/link";

const CustomerReviews = ({ reviews, modelId }) => {
  // if (reviewss.length === 0) {
  //   return <p>No reviews yet.</p>;
  // }

  return (
    <div className="mt-10 w-full border-t border-gray-200 pt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Customer Reviews & Ratings
      </h2>

      {/* Check if reviews are greater than 7, display reviews accordingly */}
      {reviews.length > 7 && (
        <>
          <div className="flex flex-col sm:flex-row gap-6  sm:items-center mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-semibold text-green-600">
                {(
                  reviews.reduce((sum, review) => sum + review.rating, 0) /
                  reviews.length
                ).toFixed(1)}
              </span>
              <div className="flex text-yellow-500 text-xl">
                {Array(5)
                  .fill(0)
                  .map((_, i) =>
                    i < Math.round(
                      reviews.reduce((sum, review) => sum + review.rating, 0) /
                        reviews.length
                    )
                      ? <IoIosStar key={i} />
                      : <IoIosStarOutline key={i} />
                  )}
              </div>
              <span className="text-gray-600 text-sm">
                ({reviews.length} Reviews)
              </span>
            </div>
          </div>

          {/* Display Reviews */}
          <div className="space-y-5 sm:m-auto max-w-200 w-full min-w-75">
            {reviews.slice(0, 7).map((review) => (
              <CustomerReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* "View All Reviews" Link */}
          <div className="flex justify-end">

          <Link
            href={`/models/${modelId}/all-reviews`}
            className="text-blue-600 hover:underline text-md mb-10 mr-4"
            >
            View All Reviews →
          </Link>
            </div>
        </>
      )}
      {reviews.length <= 7 && (
       <>
       <div className="flex flex-col sm:flex-row gap-6  sm:items-center mb-6">
         <div className="flex items-center gap-3">
           <span className="text-4xl font-semibold text-green-600">
             {(
               reviews.reduce((sum, review) => sum + review.rating, 0) /
               reviews.length
             ).toFixed(1)}
           </span>
           <div className="flex text-yellow-500 text-xl">
             {Array(5)
               .fill(0)
               .map((_, i) =>
                 i < Math.round(
                   reviews.reduce((sum, review) => sum + review.rating, 0) /
                     reviews.length
                 )
                   ? <IoIosStar key={i} />
                   : <IoIosStarOutline key={i} />
               )}
           </div>
           <span className="text-gray-600 text-sm">
             ({reviews.length} Reviews)
           </span>
         </div>
       </div>

       {/* Display Reviews */}
       <div className="space-y-5 sm:m-auto max-w-200 w-full min-w-75">
         {reviews.slice(0, 7).map((review) => (
           <CustomerReviewCard key={review.id} review={review} />
         ))}
       </div>
       <div className="flex justify-end">
         </div>
     </>
      )}
    </div>
  );
};

export default CustomerReviews;

