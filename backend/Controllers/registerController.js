import User from "../model/user.model.js";
import Subject from "../model/subject.model.js";

export const registerController = async (req, res) => {
  try {
    const {
      name,
      enrollment,
      batch,
      email,
      instructor,
      subjects,  
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    let parsedSubjects;
    try {
      parsedSubjects = JSON.parse(subjects);
    } catch (error) {
      return res.status(400).json({ message: "Invalid subjects data format" });
    }

    console.log("Parsed subjects:", parsedSubjects);

    if (!name || !email || !enrollment || !instructor) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!Array.isArray(parsedSubjects) || parsedSubjects.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one subject is required" });
    }

    for (let i = 0; i < parsedSubjects.length; i++) {
      const subject = parsedSubjects[i];
      if (
        !subject.subjectId ||
        !subject.classStartTime ||
        !subject.classEndTime ||
        !subject.classDays ||
        subject.classDays.length === 0
      ) {
        return res.status(400).json({
          message: `Subject ${
            i + 1
          } is missing required fields (subject selection, start time, end time, or class days)`,
        });
      }
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { enrollment }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({
          message: "User already exists with this email or enrollment number",
        });
    }

    const userSubjects = [];
    const subjectSchedules = [];

    for (const subjectData of parsedSubjects) {
      const subject = await Subject.findById(subjectData.subjectId);
      if (!subject) {
        return res.status(400).json({
          message: `Subject with ID ${subjectData.subjectId} not found`,
        });
      }
      userSubjects.push(subject._id.toString());
      subjectSchedules.push({
        subjectId: subject._id,
        subjectCode: subject.Code,
        subjectName: subject.name,
        classStartTime: subjectData.classStartTime,
        classEndTime: subjectData.classEndTime,
        classDays: subjectData.classDays,
        instructor: instructor, 
      });
    }

    console.log("User subjects:", userSubjects);
    console.log("Subject schedules:", subjectSchedules);
    const newUser = new User({
      fullname: name,
      ern: enrollment,
      batch,
      email,
      profilePic: req.file.path,
      subjects: userSubjects,
      subjectSchedules: subjectSchedules,  
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      data: {
        userId: newUser._id,
        subjects: subjectSchedules.length,
        enrolledSubjects: subjectSchedules.map((s) => ({
          code: s.subjectCode,
          name: s.subjectName,
          schedule: `${s.classStartTime} - ${s.classEndTime}`,
          days: s.classDays.join(", "),
        })),
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
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
      "fullname ern batch email profilePic createdAt"
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
