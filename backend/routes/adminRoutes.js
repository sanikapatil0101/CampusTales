const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const{getAllExperiences,
    approveExperience,
    rejectExperience,
    getAnalytics,
    getExperienceById}=require("../controllers/adminController")

// Protect all routes
router.use(protect, adminOnly);

router.get("/experience/all", getAllExperiences);
router.put("/experience/approve/:id",approveExperience);
router.put("/experience/reject/:id",rejectExperience);
router.get("/analytics",getAnalytics);
router.get("/experience/:id",getExperienceById);

module.exports = router;
