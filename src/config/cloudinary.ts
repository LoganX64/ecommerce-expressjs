import { v2 as cloudinary } from 'cloudinary';
import { config } from './config';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinaryCloud,
  api_key: config.cloudinaryAPIkey,
  api_secret: config.cloudinarySecret,
});

export default cloudinary;

/**
 * Upload a single image to Cloudinary from a buffer
 */
export const uploadToCloudinary = async (fileBuffer: Buffer, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          public_id: fileName,
          folder: 'product-images',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result?.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Upload failed with no URL returned'));
          }
        }
      )
      .end(fileBuffer);
  });
};
