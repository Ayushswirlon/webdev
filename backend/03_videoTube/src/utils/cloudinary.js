import cloudinary from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary
 * @param {string} localFilePath - The local path of the file
 * @param {string} resourceType - The resource type ('image' or 'video')
 */
const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
  if (!localFilePath) {
    console.error("Local file path is missing");
    return { error: "Local file path is required" };
  }

  try {
    // ✅ Corrected Cloudinary upload function
    const response = await cloudinary.v2.uploader.upload(localFilePath, {
      resource_type: resourceType, // Ensure proper file type (image/video)
    });

    console.log("✅ File uploaded to Cloudinary:", response.secure_url);

    // Delete local file after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    console.error("❌ Error uploading to Cloudinary:", error.message);

    // Delete local file even if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return { error: error.message };
  }
};

/**
 * Uploads a video to Cloudinary
 * @param {string} localFilePath - The local path of the video file
 */
const uploadVideoONCloudinary = async (localFilePath) => {
  return await uploadOnCloudinary(localFilePath, "video"); // ✅ Fix: Pass "video" as a string
};

/**
 * Deletes a file from Cloudinary
 * @param {string} publicId - The public ID of the file
 */
const deleteOnCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId, {
      resource_type: "video", // ✅ Ensure correct type while deleting
    });

    console.log("✅ Deleted from Cloudinary:", result);
    return result;
  } catch (error) {
    console.error("❌ Error deleting from Cloudinary:", error.message);
    return null;
  }
};

export { uploadOnCloudinary, deleteOnCloudinary, uploadVideoONCloudinary };
