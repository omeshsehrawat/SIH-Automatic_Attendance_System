import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
    Code:{
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    instructor: {
        type: String,
        required: true
    },
    classTime: {
        type: String,
        required: true
    },
    classDays: {
        type: [String],
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Subject', SubjectSchema);
