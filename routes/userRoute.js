import express from "express";
import { userAuth } from "../middleware/userAuth.js";
import {
  logoutUser,
  userLogin,
  userSignup,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/user-signup").post(userSignup);
router.route("/user-login").post(userLogin);
router.route("/logout-user").post(logoutUser);

export default router;
