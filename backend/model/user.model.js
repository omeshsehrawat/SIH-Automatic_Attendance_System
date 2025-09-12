import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,  
    },
    email: {
      type: String,
      required: true,  
      unique: true
    },
    password: {
      type: String,
      required: false, 
    },
    role: {
      type: String,
      required: true,  
      enum: ["admin", "student"],  
      default: "student"
    },
    profilePic: {
      type: String,
    },
    ern: {
      type: String,
      unique: true,
      sparse: true
    },
    batch: {
      type: String
    },
    subjects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject"
    }],
    subjectSchedules: [{
      subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
      },
      subjectCode: {
        type: String,
        required: true
      },
      subjectName: {
        type: String,
        required: true
      },
      classStartTime: {
        type: String,
        required: true
      },
      classEndTime: {
        type: String,
        required: true
      },
      classDays: {
        type: [String],
        required: true
      },
      instructor: {
        type: String,
        required: true
      }
    }]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);