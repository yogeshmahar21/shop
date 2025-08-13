const mongoose = require("mongoose");

const Model3DSchema = new mongoose.Schema(
    {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: String,
        software: String,
        format: String,
        category: String,
        price: Number,
        description: String,
        zipFilePath:  [
            {
                fileName: { type: String, required: true },
                fileId: { type: String, required: true },
            },
        ],
        previewImages: [
            {
                fileName: { type: String, required: true },
                fileId: { type: String, required: true },
                  url: { type: String, required: true },
            },
        ],
        tags: [String],
        lastEditedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true, // ✅ Adds createdAt and updatedAt automatically
    }
);

module.exports = mongoose.model("ModelData", Model3DSchema);
