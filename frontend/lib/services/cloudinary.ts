import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  thumbnail?: string;
  publicId: string;
}

export async function uploadVideo(file: Buffer, filename: string): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: 'testimonials',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error('Upload failed'));
          return;
        }

        // Generate thumbnail
        const thumbnailUrl = cloudinary.url(result.public_id, {
          resource_type: 'video',
          format: 'jpg',
          transformation: [
            { width: 800, height: 450, crop: 'fill' },
            { quality: 'auto' },
          ],
        });

        resolve({
          url: result.secure_url,
          thumbnail: thumbnailUrl,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(file);
  });
}

export async function uploadImage(file: Buffer, filename: string): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'testimonials',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error('Upload failed'));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(file);
  });
}

