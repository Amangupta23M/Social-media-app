import multer from "multer";
import path from "path";

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure destination directory exists
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        // Use a safe filename
        const timestamp = Date.now(); // Add a timestamp to ensure uniqueness
        const ext = path.extname(file.originalname); // Get the file extension
        const safeName = file.originalname.replace(/\s+/g, "_"); // Replace spaces in the name
        cb(null, `${timestamp}_${safeName}${ext}`);
    }
});

// Export the upload middleware
export const upload = multer({ storage: storage });
