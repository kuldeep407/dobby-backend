import express from "express";
import { userAuth } from "../middleware/userAuth.js";

import { createFolder, deleteFolder, getFolders } from "../controllers/folderController.js";

const router = express.Router();

router.route("/create-folder").post(userAuth, createFolder);
router.route("/get-folders").get(userAuth, getFolders);
router.route("/delete-folder/:folderId").get(userAuth, deleteFolder);


export default router;
