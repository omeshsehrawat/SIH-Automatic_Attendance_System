import User from "../model/user.model.js";
import Subject from "../model/subject.model.js";

export const registerController = async (req, res) => {
  try {
    const {
      name,
      enrollment,
      batch,
      email,
      subjectName,
      classTime,
      code,
      classDays,
      instructor,
    } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    if (!name || !email || !enrollment || !code || !subjectName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findOne({ $or: [{ email }, { enrollment }] });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    let subject = await Subject.findOne({ Code: code });
    if (!subject) {
      subject = new Subject({
        Code: code,
        name: subjectName,
        instructor,
        classTime,
        classDays,
      });
      await subject.save();
    }
    console.log("Subject", subject._id.toString());
    const newUser = new User({
      fullname: name,
      ern: enrollment,
      batch,
      email,
      profilePic: req.file.path,
      subjects: [subject._id.toString()],
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const suggestSubjects = async (req, res) => {
  try {
    const { query } = req.query;
    const subjects = await Subject.find({
      name: { $regex: query, $options: "i" },
    }).limit(10);
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subjects" });
  }
};

export const suggestStudents = async (req, res) => {
  try {
    const { query } = req.query;
    const students = await User.find({
      name: { $regex: query, $options: "i" },
    }).limit(10);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
};

export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subjects" });
  }
};

export const getStudentsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    console.log("Fetching students by subject ID:", subjectId);
    const students = await User.find({ subjects: subjectId }).select(
      'fullname ern batch email profilePic createdAt'
    );
    console.log("Students found:", students);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find().populate("subject");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
};
