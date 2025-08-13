const B2 = require("backblaze-b2");
require("dotenv").config();

const b2Private = new B2({
  applicationKeyId: process.env.B2_KEY_ID_FILES,
  applicationKey: process.env.B2_APP_KEY_FILES,
});

let lastPrivateAuthTime = 0;
let isAuthorizingPrivate = false;

async function ensureB2PrivateAuthorized() {
  const now = Date.now();
  const AUTH_EXPIRY = 22 * 60 * 60 * 1000;

  if (now - lastPrivateAuthTime < AUTH_EXPIRY) return;

  if (isAuthorizingPrivate) {
    while (isAuthorizingPrivate) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    return;
  }

  try {
    isAuthorizingPrivate = true;
    await b2Private.authorize();
    lastPrivateAuthTime = Date.now();
    console.log("✅ Private B2 authorized");
  } catch (err) {
    console.error("❌ Private B2 authorization failed:", err);
    throw err;
  } finally {
    isAuthorizingPrivate = false;
  }
}

module.exports = { b2Private, ensureB2PrivateAuthorized };
