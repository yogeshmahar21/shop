
const { b2Private, ensureB2PrivateAuthorized } = require("../utils/b2Private");

async function generateSignedUrl(filePath) {
  await ensureB2PrivateAuthorized();

  try {
    const result = await b2Private.getDownloadAuthorization({
      bucketId: process.env.B2_PRIVATE_BUCKET_ID,
      fileNamePrefix: filePath,
      validDurationInSeconds: 3600,
    });
const encodedPath = encodeURIComponent(filePath).replace(/%2F/g, "/");
    const authToken = result.data.authorizationToken;
    const downloadUrl = `https://f005.backblazeb2.com/file/${process.env.B2_PRIVATE_BUCKET_NAME}/${encodedPath}?Authorization=${authToken}`;

    return downloadUrl;
  } catch (err) {
    console.error("❌ Failed to generate signed URL:", err);
    throw err;
  }
}

module.exports = generateSignedUrl;
