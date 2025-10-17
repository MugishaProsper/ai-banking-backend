import cloudinaryConfig from "../config/cloudinary.config";
import multer from "multer";

export const upload = multer({ storage: cloudinaryConfig.storage });

// Upload file to Cloudinary
export const uploadToCloudinary = async (file, folder = 'banking-app') => {
    try {
        const result = await cloudinaryConfig.cloudinary.uploader.upload(file.path, {
            folder: folder,
            resource_type: 'auto'
        });
        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload failed:', error);
        throw error;
    }
};