import Folder from "../models/folderModel.js";

export async function createFolder(req, res) {
  try {
    const { name, parentId } = req.body;
    const user = req.user;

    const newFolder = new Folder({
      name,
      parentId: parentId,
      userId: user._id,
    });

    await newFolder.save();

    return res.status(201).json({
      success: true,
      message: "folder added successfully !",
      newFolder,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error !",
    });
  }
}

export async function getFolders(req, res) {
  try {
    const user = req.user;

    const folders = await Folder.find({ userId: user._id });

    if (!folders || folders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No folder found !",
      });
    }

    return res.status(200).json({
      success: true,
      message: "folder fetched successfully !",
      folders,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error !",
    });
  }
}

export async function deleteFolder(req, res) {
  const { folderId } = req.params;
  try {
    const folder = await Folder.findById({ _id: folderId });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found !",
      });
    }

    await Folder.findByIdAndDelete(folderId);

    return res.status(200).json({
      success: true,
      message: "folder deleted successfully !",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error !",
    });
  }
}
