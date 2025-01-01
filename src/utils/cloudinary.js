import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'contacts',
      use_filename: true,
      resource_type: 'image',
    });

    return { url: result.secure_url, public_id: result.public_id };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
};
