 const express = require("express");
 const router = express.Router();
 const { protect } = require("../middleware/authMiddleware");
 const { checkUsername ,becomeSeller,checkPayment } = require("../controllers/sellerController");
 

router.get("/check-username", checkUsername);
router.get("/check-payment", checkPayment);
router.post("/become",protect, becomeSeller);
 module.exports = router;
 