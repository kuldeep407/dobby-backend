import express from "express";
import multer from "multer"
import path from 'path'
import { userAuth } from "../middleware/userAuth.js";
import { getImages, searchImage, uploadImage } from "../controllers/imageController.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage });

router.route("/upload-image").post(userAuth, upload.single("image"), uploadImage);
router.route("/search-image").get(userAuth, searchImage);
router.route("/get-images").get(userAuth, getImages);


export default router;
