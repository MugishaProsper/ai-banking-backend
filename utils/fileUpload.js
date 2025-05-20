import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'banking-app',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

// Configure multer
export const upload = multer({ storage: storage });

// Upload file to Cloudinary
export const uploadToCloudinary = async (file, folder = 'banking-app') => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: 'auto'
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw error;
  }
};