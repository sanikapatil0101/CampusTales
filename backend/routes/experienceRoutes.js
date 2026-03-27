const express = require("express");
const router = express.Router();
const {
  createExperience,
  getApprovedExperiences,
  getExperienceById,
  getMyPosts
  
} = require("../controllers/experienceController");
const QUESTIONS = require("../config/questions");

const { protect } = require("../middleware/authMiddleware");

// Get predefined questions (public)
router.get("/questions/list", (req, res) => {
  res.json(QUESTIONS);
});

//experience routes 
router.get("/me", protect, getMyPosts);

// Student Routes
router.post("/", protect, createExperience); // submit new experience
router.get("/", getApprovedExperiences); // view all approved
router.get("/:id", getExperienceById); // view single experience


module.exports = router;
