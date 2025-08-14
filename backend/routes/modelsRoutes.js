// /routes/modelUpload.route.js
const express = require("express");
const multer = require("multer");
const upload = require("../utils/multer");
const {
    uploadModel,
    getMyModels, 
    deleteModel,
    getModelById,
    getModelFiles,
    updateModel,
    getModelImages,
    getAllModels,
} = require("../controllers/modelsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// router.get("/:id", protect, getModelById);
router.post(
    "/upload-model",
    protect,
    upload.fields([
        { name: "previewImages", maxCount: 8 },
        { name: "zipFile", maxCount: 1 },
    ]),
    uploadModel
);

router.get("/all", getAllModels);

router.get("/mine", protect, getMyModels);

// /api/models/:id
router.delete("/:id", protect, deleteModel);
router.get("/:id", protect, getModelById);
// router.get("/show/:id", protect, getModel);
router.get("/:id/files", protect, getModelFiles);
router.get("/:id/images", protect, getModelImages);
router.put("/update/:id", protect, updateModel);
router.post(
    "/update/:id",
    protect,
    upload.fields([
        { name: "newImages", maxCount: 8 },
        { name: "newZip", maxCount: 1 },
    ]),
    updateModel
);

module.exports = router;
