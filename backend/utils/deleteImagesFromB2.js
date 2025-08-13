const B2 = require("backblaze-b2");

const b2 = new B2({
    applicationKeyId: process.env.B2_KEY_ID,
    applicationKey: process.env.B2_APP_KEY,
});

const BUCKET_ID= process.env.B2_BUCKET_ID;
let isAuthorized = false;

async function ensureAuthorized() {
    if (!isAuthorized) {
        await b2.authorize();
        isAuthorized = true;
    }
}

async function deleteFromB2(fileName) {
    try {
        await ensureAuthorized();
        // console.log("Attempting to delete from B2:", fileName);

        const response = await b2.listFileVersions({
            bucketId: BUCKET_ID,
            prefix: fileName,
            maxFileCount: 1000,
        });
        // return console.log("matching versions is the : ", response);

      const matchingVersions = response.data.files.filter(
      (f) => f.fileName === fileName && f.action === "upload"
    );

    if (matchingVersions.length === 0) {
      console.warn(`🟡 File not found on B2: ${fileName}`);
      return;
    }

    for (const version of matchingVersions) {
      await b2.deleteFileVersion({
        fileName: version.fileName,
        fileId: version.fileId,
      });
      // console.log(`✅ Deleted version: ${version.fileName} (ID: ${version.fileId})`);
    }
    } catch (err) {
        console.error(
            `❌ Error deleting from B2: ${fileName}`,
            err || err
        );
        // }
    }
}

module.exports = deleteFromB2;
