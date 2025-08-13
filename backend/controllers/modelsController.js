// /controllers/modelUpload.controller.js
const fs = require("fs");
const uploadImagesToB2 = require("../utils/b2/uploadImagesToB2");
const uploadZipToB2 = require("../utils/b2/uploadZipToB2");
const AdmZip = require("adm-zip");
const path = require("path");
const ModelData = require("../models/Models");
const deleteImagesB2 = require("../utils/b2/deleteImagesB2");
// const initB2 = require("../helpers/upload/initB2");
const bannedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".mp4",
    ".mov",
    ".avi",
    // ".pdf",
    ".doc",
    ".docx",
    ".txt",
    ".xlsx",
    ".ppt",
];
const generateSignedUrl = require("../utils/generateSignedUrl");
const deleteZipB2 = require("../utils/b2/deleteZipb2");
const bucketNamePublic = process.env.B2_PUBLIC_BUCKET_NAME;
const bucketNamePrivate = process.env.B2_PRIVATE_BUCKET_NAME;
function isZipSafe(zipBuffer) {
    try {
        const zip = new AdmZip(zipBuffer);
        const entries = zip.getEntries();

        for (let entry of entries) {
            const ext = path.extname(entry.entryName).toLowerCase();
            if (bannedExtensions.includes(ext)) {
                return {
                    safe: false,
                    reason: ` ZIP file includes a restricted file format [${ext}]. Please remove it and try again.`,
                };
            }
        }

        return { safe: true };
    } catch (err) {
        return {
            safe: false,
            reason: " Invalid or corrupted ZIP file",
        };
    }
}
const generateFileName = (userId, folder, originalName) =>
    `user-${userId}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}-${originalName}`;

exports.uploadModel = async (req, res) => {
    console.log("Uploading model...");
    try {
        const userId = req.user.id;
        const { title, price, description, software, format, tags, category } =
            req.body;
        const zipFile = req.files.zipFile?.[0];
        const previewImages = req.files.previewImages || [];

        if (!zipFile) {
            return res
                .status(400)
                .json({ success: false, message: "ZIP file is required." });
        }

        const result = isZipSafe(fs.readFileSync(zipFile.path));
        if (!result.safe) {
            return res.status(400).json({ message: result.reason });
        }

        if (zipFile.size > process.env.MAX_ZIP_SIZE) {
            return res.status(400).json({ message: "ZIP file too large." });
        }
        const uploadedImages = await uploadImagesToB2(previewImages, userId);
        const zipFileName = await uploadZipToB2(zipFile, userId);
        console.log("this is uploaded iamges are here  ", uploadedImages);

        [...previewImages, zipFile].forEach((f) => {
            try {
                fs.unlinkSync(f.path);
            } catch (err) {
                console.warn(
                    "Failed to delete temp file:",
                    f.path,
                    err.message
                );
            }
        });

        const modelDoc = await ModelData.create({
            seller: userId,
            title,
            description,
            software,
            category,
            format,
            price,
            zipFilePath: zipFileName,
            tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
            previewImages: uploadedImages,
        });

        res.json({
            success: true,
            message: "Model uploaded & saved successfully",
            data: modelDoc,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Upload failed" });
    }
};

exports.getMyModels = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const sort = req.query.sort || "";

        // Pagination values from query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let sortQuery = {};

        // Define sort logic
        switch (sort) {
            case "price-desc":
                sortQuery.price = -1;
                break;
            case "price-asc":
                sortQuery.price = 1;
                break;
            case "software-asc":
                sortQuery.software = 1;
                break;
            case "software-desc":
                sortQuery.software = -1;
                break;
            case "date":
                sortQuery.createdAt = 1; // Newest first
                break;
            default:
                sortQuery = { createdAt: -1 }; // Optional: default by date
        }

        const total = await ModelData.countDocuments({ seller: sellerId });
        const models = await ModelData.find({ seller: sellerId })
            .sort(sortQuery)
            .skip(skip)
            .limit(limit)
            .select("-zipFilePath"); // ✅ Don’t send ZIP paths to frontend

        res.status(200).json({
            models,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error fetching models:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete a model
exports.deleteModel = async (req, res) => {
    try {
        const model = await ModelData.findById(req.params.id);

        if (!model) {
            return res.status(404).json({ error: "Model not found" });
        }

        if (model.seller.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        console.log("this is model ", model);
        // return;
        // ✅ Delete ZIP file from B2
        if (model.zipFilePath) {
            await Promise.all(
                model.zipFilePath.map(({ fileName, fileId }) =>
                    deleteZipB2(fileName, fileId)
                )
            );
        }

        // ✅ Delete preview images from B2
        if (model.previewImages && model.previewImages.length > 0) {
            await Promise.all(
                model.previewImages.map(({ fileName, fileId }) =>
                    deleteImagesB2(fileName, fileId)
                )
            );
        }

        // ✅ Delete model from DB
        await model.deleteOne();

        res.status(200).json({
            message: "Model and files deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting model:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// /controllers/modelsController.js

exports.getModelById = async (req, res) => {
    try {
        const model = await ModelData.findById(req.params.id).populate(
            "seller",
            "name"
        );

        if (!model) return res.status(404).json({ message: "Model not found" });

        if (model.seller._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const modelObj = model.toObject();
        delete modelObj.zipFilePath;
        console.log("all modoels are here ", modelObj.previewImages[0].url);
        res.status(200).json(modelObj);
    } catch (error) {
        console.error("Error fetching model:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getModelFiles = async (req, res) => {
    try {
        const modelId = req.params.id;
        const model = await ModelData.findById(modelId);

        if (!model) {
            return res.status(404).json({ error: "Model not found" });
        }

        if (model.seller.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        // console.log("this is model zip file path ", model);
        if (!model.zipFilePath) {
            return res.status(404).json({ error: "ZIP file is missing" });
        }

        if (!model) {
            return res.status(404).json({ error: "Model not found" });
        }
        const signedZipUrl = await generateSignedUrl(
            model.zipFilePath[0]?.fileName
        );

        res.json({
            zipFile: signedZipUrl,
        });
    } catch (err) {
        console.error("Error generating signed B2 URLs:", err);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getModelImages = async (req, res) => {
    try {
        const modelId = req.params.id;
        const model = await ModelData.findById(modelId);

        if (!model) {
            return res.status(404).json({ error: "Model not found" });
        }

        if (model.seller.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        if (
            !Array.isArray(model.previewImages) ||
            model.previewImages.length === 0
        ) {
            return res
                .status(404)
                .json({ error: "Preview images are missing" });
        }

        if (!model) {
            return res.status(404).json({ error: "Model not found" });
        }

        const previewImages = model.previewImages.map(({ fileName }) => ({
            url: `https://f005.backblazeb2.com/file/${process.env.B2_PUBLIC_BUCKET_NAME}/${fileName}`,
            // url: `https://f005.backblazeb2.com/file/${process.env.B2_PUBLIC_BUCKET_NAME}/${fileKey}?width=40&quality=10`,
            key: fileName,
        }));

        res.json({
            previewImages,
        });
    } catch (err) {
        console.error("Error generating signed B2 URLs:", err);
        res.status(500).json({ error: "Server error" });
    }
};
function extractB2PathAndFileName(url) {
    const cleanUrl = url.split("?")[0]; // Remove query params
    const parts = cleanUrl.split("/");

    // Find the index of your B2 bucket name ("Maharboy" here)
    const bucketIndex = parts.indexOf(bucketNamePublic);

    // Slice from after the bucket name to the end
    const b2PathParts = parts.slice(bucketIndex + 1);
    const fullB2Path = b2PathParts.join("/");
    const fileName = b2PathParts[b2PathParts.length - 1];

    return fullB2Path;
    // fileName,;
}

exports.updateModel = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        console.log("user ", userId);
        const model = await ModelData.findById(id);
        if (!model) return res.status(404).json({ message: "Model not found" });

        if (model.seller.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const now = new Date();
        const created = model.createdAt;
        const lastEdited = model.lastEditedAt;

        // Check if model was created today
        const isCreatedToday =
            created.getDate() === now.getDate() &&
            created.getMonth() === now.getMonth() &&
            created.getFullYear() === now.getFullYear();

        if (isCreatedToday) {
            // Model uploaded today
            if (lastEdited) {
                // Already edited today once, enforce 24 hour rule
                const hoursSinceLastEdit =
                    (now - lastEdited) / (1000 * 60 * 60);
                if (hoursSinceLastEdit < 24) {
                    return res.status(429).json({
                        message: `You can only edit this model once every 24 hours.`,
                        hoursLeft: (24 - hoursSinceLastEdit).toFixed(1),
                    });
                }
            }
            // else no lastEdited yet => first edit allowed anytime today
        } else {
            // Model NOT created today
            if (lastEdited) {
                // Check 24 hour rule
                const hoursSinceLastEdit =
                    (now - lastEdited) / (1000 * 60 * 60);
                if (hoursSinceLastEdit < 24) {
                    return res.status(429).json({
                        message: `You can only edit this model once every 24 hours.`,
                        hoursLeft: (24 - hoursSinceLastEdit).toFixed(1),
                    });
                }
            }
            // else no lastEdited => first edit ever, allow now
        }

        const {
            title,
            description,
            price,
            software,
            category,
            tags,
            format,
            existingImages,
            existingZip,
        } = req.body;
        console.log("all models", model);
        // return;
        const existingImageList = JSON.parse(existingImages || "[]");
        const extractedImagePaths = existingImageList.map(
            extractB2PathAndFileName
        );
        const fileNameArray = model.previewImages.map(
            (image) => image.fileName
        );

        const imagesToDelete = fileNameArray.filter(
            (fileName) => !extractedImagePaths.includes(fileName)
        );
        const newImages = req.files?.newImages || [];
        const newZip = req.files?.newZip?.[0];
        let uploadedNewImages = [];
        if (newImages && newImages.length > 0) {
            uploadedNewImages = await uploadImagesToB2(newImages, userId);
        }
        const filteredImages = model.previewImages.filter(
            (fileObj) => !imagesToDelete.includes(fileObj.fileName)
        );
        const finalImagesToDelete = model.previewImages.filter((fileObj) =>
            imagesToDelete.includes(fileObj.fileName)
        );
        if (finalImagesToDelete && finalImagesToDelete.length > 0) {
            await Promise.all(
                finalImagesToDelete.map(({ fileName, fileId }) =>
                    deleteImagesB2(fileName, fileId)
                )
            );
        }
        const finalImages = [...filteredImages, ...uploadedNewImages];

        // 🔁 Handle ZIP Update
        const zipFileName = model.zipFilePath;
        let finalZipFile = [];
        console.log("this is model zip file path ", model);
        console.log("this is new zip file ", newZip);
        console.log("this is model zip file name ", model.zipFilePath);
        // return;
        if (newZip) {
            if (model.zipFilePath) {
                console.log("this is model zip file path ", model.zipFilePath);
                await Promise.all(
                    model.zipFilePath.map(({ fileName, fileId }) =>
                        deleteZipB2(fileName, fileId)
                    )
                );
            }
            finalZipFile = await uploadZipToB2(newZip, userId);
        } else {
            finalZipFile = zipFileName;
        }

        [...newImages, newZip].forEach((f) => {
            try {
                fs.unlinkSync(f.path);
            } catch (err) {
                console.warn(
                    "Failed to delete temp file:",
                    f.path,
                    err.message
                );
            }
        });

        Object.assign(model, {
            title: title || model.title,
            description: description || model.description,
            price: price || model.price,
            software: software || model.software,
            category: category || model.category,
            tags: tags || model.tags,
            format: format || model.format,
            previewImages: finalImages,
            zipFilePath: finalZipFile,
            lastEditedAt: now, // 👈 store edit time
        });

        await model.save();

        res.status(200).json({ message: "Model updated", model });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
