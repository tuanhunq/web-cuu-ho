//Mô hình dữ liệu cứu hộ

import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  type: { type: String, default: "xe-may" }, // xe-may, oto, thientai, yte, dongvat
  phone: String,
  location: {
    // either text or coordinates
    text: String,
    coords: { lat: Number, lon: Number }
  },
  description: String,
  status: { type: String, enum: ["pending","assigned","in_progress","done","cancelled"], default: "pending" },
  assignedTeam: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Report", reportSchema);
