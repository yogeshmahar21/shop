"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const LikeButton = ({ model, isLiked, toggleLike }) => {
    const liked = isLiked(model.id);

    return (
        <motion.div
            className="select-none rounded-full p-2 cursor-pointer transition-colors duration-200 "
            onClick={() => toggleLike(model)}
            initial={false}
            animate={
                liked
                    ? {
                          scale: [1, 1.4, 0.8, 1],
                      }
                    : {}
            }
            transition={{
                duration: 0.45,
                ease: [0.04, 0.4, 0.5, 0.95],
            }}
        >
            <Heart
                className="cursor-pointer"
                size={16}
                fill={liked ? "red" : "#c4c4c4"}
                color={liked ? "red" : "#c4c4c4"}
            />
        </motion.div>
    );
};

export default LikeButton;
