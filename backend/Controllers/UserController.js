import User from "../model/user.model.js";
import generateCookie from "../util/helper/generateCookie.js";
import bcrypt from "bcrypt";

const signupController = async (req, res) => {
  try {
    const { name, email } = req.body;
    let { password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    let isAdmin = false;
    if (email === "admin@gmail.com") {
      isAdmin = true;
    }
    if (user.password) {
      res.status(404).json({ err: "user alreay exist" });
    } else {
      user.fullname = name;
      user.password = hashedPass;
      user.role = isAdmin ? "admin" : "user";
      await user.save();
      generateCookie(user._id, res);
      return res.status(200).json({
        _id: user._id,
        email: user.email,
        fullname: user.name,
        role: user.role,
      });
    }
    const newUser = new User({
      fullname: name,
      email,
      password: hashedPass,
      role: isAdmin ? "admin" : "user",
    });

    await newUser.save();

    if (newUser) {
      generateCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        fullname: newUser.name,
        role: newUser.role,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `server error ${error}` });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ err: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ err: "user not exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ err: "Invalid credentials" });
    }
    generateCookie(user._id, res);
    console.log("User found:", user);
    console.log(user);
    return res.status(200).json({
      _id: user._id,
      fullname: user.name,
      email: user.email,
      role: user.role,
      subjects: user.subjects,
      batch: user.batch,
      ern: user.ern,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      return res.status(500).json({ err: "Internal server error" });
    }
  }
};

const logoutController = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log("Error in signupUser: ", error);
    res.status(500).json({ error });
  }
};

export { signupController, loginController, logoutController };
