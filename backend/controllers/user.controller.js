import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).send({
        success: false,
        message: "all filed are required",
      });
    }
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).send({
        success: false,
        message: "user already registered with this email",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });
    return res.status(200).send({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).send({
        success: false,
        message: "all filed are required ",
      });
    }
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "incorrect email or password",
      });
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).send({
        success: false,
        message: "incorrect email or password ",
      });
    }
    //check role is correct or not
    if (role !== user.role) {
      return res.status(400).send({
        success: false,
        message: "account does not exgist with correct role ",
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .send({
        success: true,
        message: `welcome back ${user.fullname}`,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).send({
      success: true,
      message: "logout successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;

    //cloudinary ayaga idher

    const skillsArray = skills.split(",");
    const userId = req.id; // middleware authentication
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }
    //updating data
    if (fullname) {
      user.fullname = fullname;
    }
    if (email) {
      user.email = email;
    }
    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }
    if (bio) {
      user.profile.bio = bio;
    }
    if (skills) {
      user.profile.skills = skillsArray;
    }

    //resume comes later here...

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).send({
      success: true,
      message: "profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
