const B2 = require("backblaze-b2");
require("dotenv").config();

const b2Public = new B2({
  applicationKeyId: process.env.B2_KEY_ID_IMAGES,
  applicationKey: process.env.B2_APP_KEY_IMAGES,
});

let lastPublicAuthTime = 0;
let isAuthorizingPublic = false;

async function ensureB2PublicAuthorized() {
  const now = Date.now();
  const AUTH_EXPIRY = 22 * 60 * 60 * 1000;

  if (now - lastPublicAuthTime < AUTH_EXPIRY) return;

  if (isAuthorizingPublic) {
    while (isAuthorizingPublic) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    return;
  }

  try {
    isAuthorizingPublic = true;
    await b2Public.authorize();
    lastPublicAuthTime = Date.now();
    console.log("✅ Public B2 authorized");
  } catch (err) {
    console.error("❌ Public B2 authorization failed:", err);
    throw err;
  } finally {
    isAuthorizingPublic = false;
  }
}

module.exports = { b2Public, ensureB2PublicAuthorized };
