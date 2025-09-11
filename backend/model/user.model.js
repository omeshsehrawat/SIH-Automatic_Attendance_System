import mongoose,{ Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: false,
    },
    role: {
      type: String,
      require: true,
      emum: ["admin", "student"],
    },
    profilePic: {
      type: String,
    },
    ern:{
      type:String,
      unique:true,
      sparse:true
    },
    batch:{
      type:String
    },
    subjects:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Subject"
    }]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
