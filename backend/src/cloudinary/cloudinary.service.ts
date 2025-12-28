import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadVideo(file: Express.Multer.File): Promise<{
    url: string;
    thumbnail: string;
  }> {
    return new Promise((resolve, reject) => {
      // Convert file buffer to base64 or use upload_stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'testimonials',
          format: 'webm', // Keep original format or convert to mp4
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            // Generate thumbnail
            const thumbnailUrl = cloudinary.url(result.public_id, {
              resource_type: 'video',
              format: 'jpg',
              transformation: [
                { width: 400, height: 300, crop: 'fill' },
                { quality: 'auto' },
              ],
            });

            resolve({
              url: result.secure_url,
              thumbnail: thumbnailUrl,
            });
          }
        },
      );

      // Write buffer to stream
      uploadStream.end(file.buffer);
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'testimonials',
          format: 'jpg',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}

