const fs = require("fs");
const axios = require("axios");
const path = require("path");
const crypto = require("crypto");
const { b2Public, ensureB2PublicAuthorized } = require("../b2Public");

const PUBLIC_BUCKET_ID = process.env.B2_PUBLIC_BUCKET_ID;
const PUBLIC_BUCKET_NAME = process.env.B2_PUBLIC_BUCKET_NAME;

const generateImageFileName = (userId, originalName) => {
    const ext = path.extname(originalName); // .jpg, .png etc
    const baseName = path.basename(originalName, ext);
    const timestamp = Date.now();
    const randomHash = crypto.randomBytes(4).toString("hex");
    return `user-${userId}/images/${baseName}_${timestamp}_${randomHash}${ext}`;
};
// `user-${userId}/images/${Date.now()}-${Math.random().toString(36).slice(2)}-${originalName}`;

async function uploadImagesToB2(files, userId) {
    await ensureB2PublicAuthorized();
    const uploadedFileKeys = [];

    const { data: uploadUrlData } = await b2Public.getUploadUrl({
        bucketId: PUBLIC_BUCKET_ID,
    });

    for (const file of files) {
        const fileName = generateImageFileName(userId, file.originalname);
        const fileBuffer = fs.readFileSync(file.path);

        const response = await axios.post(uploadUrlData.uploadUrl, fileBuffer, {
            headers: {
                Authorization: uploadUrlData.authorizationToken,
                "X-Bz-File-Name": encodeURIComponent(fileName),
                "Content-Type": file.mimetype || "b2/x-auto",
                "X-Bz-Content-Sha1": "do_not_verify",
                "X-Bz-Info-cache-control": encodeURIComponent(
                    "public, max-age=31536000, immutable"
                ),
            },
        });

        const publicUrl = `https://f005.backblazeb2.com/file/${PUBLIC_BUCKET_NAME}/${encodeURIComponent(fileName)}`;

        uploadedFileKeys.push({
            fileName,
            fileId: response.data.fileId,
            url: publicUrl,
        });
        fs.unlinkSync(file.path);
    }

    return uploadedFileKeys;
    //   return uploadedFileKeys.map((key) =>
    //     `https://f005.backblazeb2.com/file/${PUBLIC_BUCKET_NAME}/${key}`
    //   );
}

module.exports = uploadImagesToB2;
