const Experience = require("../models/Experience");
const QUESTIONS = require("../config/questions");

// @desc Create new experience
// @route POST /api/experience
// @access Private (Student)
const createExperience = async (req, res) => {
  try {
    const { companyName, type, experienceText, year, branch, passoutYear, placementType, questions, additionalNotes } = req.body;

    if (!companyName || !type || !experienceText || !year || !branch || !passoutYear || !placementType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const experience = await Experience.create({
      student: req.user.id,
      companyName,
      type,
      experienceText,
      year,
      branch,
      passoutYear,
      placementType,
      questions: questions || [],
      additionalNotes: additionalNotes || "",
      status: "pending",
    });

    res.status(201).json(experience);
  } catch (error) {
    console.error("Error creating experience:", error);
    res.status(500).json({ message: error.message });
  }
};


// @desc Get all approved experiences
// @route GET /api/experience
// @access Public
const getApprovedExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ status: "approved" })
      .populate("student", "name email")
      .sort({ createdAt: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get single experience by ID
// @route GET /api/experience/:id
const getExperienceById = async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id)
      .populate("student", "name email");

    if (!exp) {
      return res.status(404).json({
        message: "Experience not found"
      });
    }

    if (exp.status !== "approved") {
      return res.status(400).json({
        message: "Experience not approved",
        status: exp.status,                 // "pending" | "rejected"
        studentId: exp.student._id.toString() // REQUIRED for frontend
      });
    }

    return res.status(200).json(exp);

  } catch (error) {
    console.error("getExperienceById error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


// @desc Get all pending experiences (Admin)
// @route GET /api/experience/admin/pending
// @access Admin
const getPendingExperiences = async (req, res) => {
  try {
    const pending = await Experience.find({ status: "pending" }).populate("student", "name email");
    res.json(pending);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Approve experience (Admin)
// @route PUT /api/experience/admin/approve/:id
// @access Admin
const approveExperience = async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: "Experience not found" });

    exp.status = "approved";
    await exp.save();
    res.json({ message: "Experience approved" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Reject experience (Admin)
// @route PUT /api/experience/admin/reject/:id
const rejectExperience = async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: "Experience not found" });

    exp.status = "rejected";
    await exp.save();
    res.json({ message: "Experience rejected" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// @desc Get all experiences of logged-in student (any status)
const getMyExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ student: req.user.id })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getMyPosts = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Correct query: student is stored as ObjectId
    const posts = await Experience.find({ student: req.user.id })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Failed to fetch my posts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports={createExperience,
  getApprovedExperiences,
  getExperienceById,
  getPendingExperiences,
  approveExperience,
  rejectExperience,
  getMyExperiences,
  getMyPosts
};