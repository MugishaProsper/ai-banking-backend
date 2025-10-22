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
        logger.info(`File uploaded to Cloudinary: ${result.secure_url}`)
        return result.secure_url;
    } catch (error) {
        logger.error('Cloudinary upload failed:', error);
        throw error;
    }
};