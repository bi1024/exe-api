import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";




cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadImage = (fileBuffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "exe" },
      (error, result) => {
        if (error || !result) {
          console.error(
            "Cloudinary upload error:",
            error || "No result returned",
          );
          reject(error || new Error("No result returned from Cloudinary"));
        } else {
          console.log("Uploaded Image URL:", result.secure_url);
          resolve(result.secure_url);
        }
      },
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export default cloudinary;
