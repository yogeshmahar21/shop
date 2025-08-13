import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { FaThumbsUp } from "react-icons/fa";
import { useEffect, useState } from "react";

const CustomerReviewCard = ({ review }) => {
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const likeKey = `helpful_review_${review.id}`;
  const countKey = `helpful_review_count_${review.id}`;

  useEffect(() => {
    const isLiked = localStorage.getItem(likeKey);
    const storedCount = localStorage.getItem(countKey);

    if (isLiked === "true") {
      setLiked(true);
    }
    if (storedCount) {
      setHelpfulCount(parseInt(storedCount, 10));
    } else {
      setHelpfulCount(review.helpful || 0); // fallback if no localStorage
    }
  }, [likeKey, countKey, review.helpful]);

  const handleHelpfulClick = () => {
    if (!liked) {
      const newCount = helpfulCount + 1;
      setHelpfulCount(newCount);
      setLiked(true);
      localStorage.setItem(likeKey, "true");
      localStorage.setItem(countKey, newCount.toString());
    }
  };

  return (
    <div className="bg-white border rounded-2xl p-5 shadow-md hover:shadow-lg transition mb-6">
      <div className="flex items-center gap-4">
        <img
          src="/user.png"
          alt={review.name}
          className="w-12 h-12 rounded-full cursor-pointer object-cover user-select-none"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="cursor-pointer font-semibold text-gray-900 user-select-none">{review.name}</p>
              <p className="text-gray-500 text-sm">{review.date}</p>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md">
              Verified Buyer
            </span>
          </div>
          <div className="flex text-yellow-500 text-xl mt-1">
            {Array(5)
              .fill(0)
              .map((_, i) =>
                i < review.rating ? (
                  <IoIosStar key={i} />
                ) : (
                  <IoIosStarOutline key={i} />
                )
              )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-gray-700 leading-relaxed">
        {review.comment.length > 300
          ? `${review.comment.slice(0, 300)}...`
          : review.comment}
      </p>

      {/* Helpful Button + Count */}
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <button
          onClick={handleHelpfulClick}
          className={`flex cursor-pointer items-center gap-1 px-3 py-1 rounded-full border ${
            liked
              ? "bg-green-100 text-green-700 border-green-300"
              : "hover:bg-gray-100 border-gray-300"
          } transition duration-200`}
        >
          <FaThumbsUp className={liked ? "text-green-600" : ""} />
          Helpful
        </button>
        {helpfulCount > 0 && (
          <span className="text-xs text-gray-500">
            {helpfulCount} {helpfulCount === 1 ? "person found this helpful" : "people found this helpful"}
          </span>
        )}
      </div>
    </div>
  );
};

export default CustomerReviewCard;
