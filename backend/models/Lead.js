import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    city: String,
    service: String,
    budget: Number,
    status: {
      type: String,
      enum: ["New", "Interested", "Converted", "Rejected"],
      default: "New",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);