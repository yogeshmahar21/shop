const { b2Public, ensureB2PublicAuthorized } = require("../b2Public");
require("dotenv").config();

const BUCKET_ID = process.env.B2_PUBLIC_BUCKET_ID;

async function deleteImagesB2(fileName, fileId) {
  try {
    if (!fileId) {
      console.warn(`FileId missing for ${fileName}, cannot delete.`);
      return;
    }

    await ensureB2PublicAuthorized();

    await b2Public.deleteFileVersion({
      fileName,
      fileId,
    });

    console.log(`✅ Deleted: ${fileName}`);
  } catch (err) {
    console.error(`❌ Failed to delete ${fileName}:`, err.message);
  }
}

module.exports = deleteImagesB2;
