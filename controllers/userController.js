import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export async function userSignup(req, res) {
  try {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please fill the required fields !",
        });
    }

    const findExistingUser = await User.findOne({ email });
    if (findExistingUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already exist, please login !",
        });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const hashedPwd = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPwd,
    });

    await user.save();

    return res
      .status(201)
      .json({ success: true, message: "Sign up successful !", user });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({
        success: false,
        message: err.message || "Internal Server Error !",
      });
  }
}

export async function userLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "No user found, please signup !" });
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return res.status(400).json({ message: "Incorrect password !" });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "5h" }
    );
    res.cookie("jwt", token, {
      strict: true,
      secure: true,
      httpOnly: true,
      sameSite: "Strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "Login successful !", token });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({
        success: false,
        message: err.message || "Internal Server Error !",
      });
  }
}

export async function logoutUser(req, res) {
  try {
    res.cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
    });

    return res
      .status(200)
      .json({ success: true, message: "Logout successful !" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({
        success: false,
        message: err.message || "Internal Server Error !",
      });
  }
}
