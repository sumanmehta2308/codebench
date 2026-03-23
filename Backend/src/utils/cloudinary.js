const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// WORKFLOW:
// 1. Backend reads keys from .env
// 2. config() initializes the connection.
// 3. uploadOnCloudinary receives the local path from Multer.
// 4. A 'timestamp' is created (Required for Signed Uploads).
// 5. Cloudinary utility signs the parameters using your SECRET KEY.
// 6. The file + signature + api_key are sent to Cloudinary.
// 7. Local file is deleted to keep the server clean.

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folder = "user_avatars") => {
  try {
    // Safety Check: Verify file exists before starting
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      console.error("❌ File not found at path:", localFilePath);
      return null;
    }

    // STEP A: Create Timestamp
    const timestamp = Math.round(new Date().getTime() / 1000);

    // STEP B: Parameters to Sign
    const paramsToSign = {
      timestamp: timestamp,
      folder: folder,
    };

    // STEP C: Generate Digital Signature
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    // STEP D: Secure Upload
    const response = await cloudinary.uploader.upload(localFilePath, {
      ...paramsToSign,
      signature: signature,
      api_key: process.env.CLOUDINARY_API_KEY,
      resource_type: "auto",
    });

    console.log("✅ Secure Upload Successful:", response.secure_url);

    // STEP E: Safe Cleanup
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    console.error("❌ CLOUDINARY_ERROR:", error.message);

    // Cleanup on failure
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};
 /**
 * HELPER: Extract Public ID from URL
 * Cloudinary needs the 'Public ID' (the filename) to delete a file.
 * Example: "https://res.cloudinary.com/demo/image/upload/v1234/user_avatars/my_pic.jpg" 
 * Extraction: "user_avatars/my_pic"
 */
const getPublicIdFromUrl = (url) => {
  try {
    const parts = url.split("/");
    const fileNameWithExtension = parts.pop(); // "my_pic.jpg"
    const folderName = parts.pop(); // "user_avatars"
    const publicId = fileNameWithExtension.split(".")[0]; // "my_pic"
    return `${folderName}/${publicId}`;
  } catch (error) {
    return null;
  }
};

/**
 * DELETE FROM CLOUDINARY
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    // We use the 'destroy' method for deletion
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("CLOUDINARY_DELETE_ERROR:", error.message);
    return null;
  }
};
module.exports = {
  uploadOnCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
};
