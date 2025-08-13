const fs = require("fs");
const axios = require("axios");
const path = require("path");
const crypto = require("crypto");
const { b2Private, ensureB2PrivateAuthorized } = require("../b2Private");

const PRIVATE_BUCKET_ID = process.env.B2_PRIVATE_BUCKET_ID;
const PRIVATE_BUCKET_NAME = process.env.B2_PRIVATE_BUCKET_NAME;

const generateZipFileName = (userId, originalName) => {
    const ext = path.extname(originalName); // should be .zip
    const baseName = path.basename(originalName, ext);
    const timestamp = Date.now();
    const randomHash = crypto.randomBytes(4).toString("hex");
    return `user-${userId}/zips/${baseName}_${timestamp}_${randomHash}${ext}`;
};

async function uploadZipToB2(zipFile, userId) {
    await ensureB2PrivateAuthorized();
    const uploadZipKey = [];
    // Get upload URL for the bucket
    const { data: uploadUrlData } = await b2Private.getUploadUrl({
        bucketId: PRIVATE_BUCKET_ID,
    });

    const fileName = generateZipFileName(userId, zipFile.originalname);
    const fileBuffer = fs.readFileSync(zipFile.path);

    const response = await axios.post(uploadUrlData.uploadUrl, fileBuffer, {
        headers: {
            Authorization: uploadUrlData.authorizationToken,
            "X-Bz-File-Name": encodeURIComponent(fileName),
            "Content-Type": zipFile.mimetype || "application/zip",
            "X-Bz-Content-Sha1": "do_not_verify",
            "X-Bz-Info-cache-control": encodeURIComponent(
                "private, max-age=0, no-transform"
            ),
        },
    });

    uploadZipKey.push({
        fileName,
        fileId: response.data.fileId,
    });
    fs.unlinkSync(zipFile.path);
    return uploadZipKey;
}

module.exports = uploadZipToB2;
