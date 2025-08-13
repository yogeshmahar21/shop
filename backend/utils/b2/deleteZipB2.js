const { b2Private, ensureB2PrivateAuthorized } = require("../b2Private"); // adjust if needed
require("dotenv").config();

const BUCKET_ID = process.env.B2_PRIVATE_BUCKET_ID; // your ZIP bucket env var

async function deleteZipB2(fileName, fileId) {
  try {
    if (!fileId) {
      console.warn(`FileId missing for ${fileName}, cannot delete.`);
      return;
    }

    await ensureB2PrivateAuthorized();

    await b2Private.deleteFileVersion({
      fileName,
      fileId,
    });

    console.log(`✅ Deleted ZIP: ${fileName}`);
  } catch (err) {
    console.error(`❌ Failed to delete ZIP ${fileName}:`, err.message);
  }
}

module.exports = deleteZipB2;
