import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });

    console.log("File uploaded to Cloudinary:", response.url);

    // Ensure the file exists before deleting
    await fs.access(localFilePath);
    await fs.unlink(localFilePath);

    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);

    // Ensure the file exists before deleting
    try {
      await fs.access(localFilePath);
      await fs.unlink(localFilePath);
    } catch (deleteError) {
      console.error("Error deleting local file:", deleteError);
    }

    return null;
  }
};

export { uploadOnCloudinary };
