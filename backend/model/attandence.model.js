import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",  
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now, 
    },
    status: {
      type: String,
      enum: ["Present", "Absent"],  
      default: "Absent",
      required: true,
    },
    time: {
      type: String, 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
