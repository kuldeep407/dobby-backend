import Image from "../models/imageModel.js";

export async function uploadImage(req, res) {
  try {
    const { name, folderId } = req.body;
    const user = req.user;

    const imageUrl = `/uploads/${req.file.filename}`;

    const newImage = new Image({
      name,
      imageUrl,
      folderId,
      userId: user._id,
    });

    await newImage.save();

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully !",
      newImage,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error !",
    });
  }
}

export async function searchImage(req, res) {
  try {
    const { query } = req.query;
    const user = req.user;

    const images = await Image.find({
      userId: user._id,
      name: { $regex: query, $options: "i" },
    });

    return res.status(200).json({
      success: true,
      message: "Images retrieved successfully!",
      images,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error!",
    });
  }
}

export async function getImages(req, res) {
  try {
    const { folderId } = req.query;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized!" });
    }

    const query = { userId: user._id };
    if (folderId) query.folderId = folderId;

    const images = await Image.find(query).select("name imageUrl folderId");

    return res.status(200).json({
      success: true,
      message: "Images fetched successfully!",
      images,
    });
  } catch (err) {
    console.error("Error fetching images:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error!",
    });
  }
}
