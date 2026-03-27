const Experience = require("../models/Experience");
const User = require("../models/User");

// Get all experiences (Admin)
const getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find()
      .populate("student", "name email year") // populate student details
      .lean() // Return plain JavaScript objects
      .sort({ createdAt: -1 });

    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single experience by ID 
const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id)
      .populate("student", "name email year");

    if (!experience)
      return res.status(404).json({ message: "Experience not found" });

    res.json(experience);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve experience 
const approveExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience)
      return res.status(404).json({ message: "Experience not found" });

    experience.status = "approved";
    await experience.save();

    res.json({ message: "Experience approved", experience });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject experience 
const rejectExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience)
      return res.status(404).json({ message: "Experience not found" });

    experience.status = "rejected";
    await experience.save();

    res.json({ message: "Experience rejected", experience });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Analytics 
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalExperiences = await Experience.countDocuments();
    const totalApproved = await Experience.countDocuments({ status: "approved" });
    const totalPending = await Experience.countDocuments({ status: "pending" });
    const totalRejected = await Experience.countDocuments({ status: "rejected" });

    res.json({
      totalUsers,
      totalExperiences,
      totalApproved,
      totalPending,
      totalRejected,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllExperiences,
  getExperienceById,
  approveExperience,
  rejectExperience,
  getAnalytics,
};
