import multer from "multer";
const storage = multer.memoryStorage(); // store in RAM for fast upload to Cloudinary
const upload = multer({ storage });

export default upload;