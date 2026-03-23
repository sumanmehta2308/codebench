const mongoose = require("mongoose");
const { Schema } = mongoose;

const submissionSchema = new Schema(
  {
    problem: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
    },
    madeBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);