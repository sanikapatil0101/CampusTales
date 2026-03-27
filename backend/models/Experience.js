const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["Internship", "PPO", "Internship+Placement"],
      required: true,
    },
    experienceText: {
      type: String,
      required: [true, "Experience description is required"],
      minlength: 20,
    },
    year: {
      type: String,
      enum: ["1st", "2nd", "3rd", "4th"],
      required: true,
    },
    branch: {
      type: String,
      required: [true, "Branch is required"],
    },
    passoutYear: {
      type: String,
      required: [true, "Passout year is required"],
    },
    placementType: {
      type: String,
      enum: ["On-Campus", "Off-Campus"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    // views: {
    //   type: Number,
    //   default: 0,
    // },
    questions: [
      {
        _id: false,
        questionId: String,
        question: String,
        answer: String,
      },
    ],
    additionalNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experience", experienceSchema);
