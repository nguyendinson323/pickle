import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export interface FileUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  originalFilename: string;
  bytes: number;
  format: string;
  resourceType: string;
}

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  folder: string;
}

class CloudinaryService {
  private isConfigured: boolean = false;

  constructor() {
    this.initializeCloudinary();
  }

  private initializeCloudinary() {
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    };

    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      console.warn('Cloudinary configuration incomplete. File uploads will not work.');
      return;
    }

    cloudinary.config(config);
    this.isConfigured = true;
  }

  private bufferToStream(buffer: Buffer): Readable {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
  }

  async uploadToCloudinary(
    buffer: Buffer,
    folder: string,
    originalName: string,
    options: any = {}
  ): Promise<FileUploadResult> {
    if (!this.isConfigured) {
      throw new Error('Cloudinary is not properly configured');
    }

    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: `${process.env.CLOUDINARY_FOLDER || 'pickleball-admin'}/${folder}`,
        public_id: `${Date.now()}_${originalName.split('.')[0]}`,
        resource_type: 'auto' as const,
        ...options,
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error: any, result: any) => {
          if (error) {
            reject(new Error(`Cloudinary upload error: ${error.message}`));
            return;
          }

          if (!result) {
            reject(new Error('Upload failed: No result returned'));
            return;
          }

          resolve({
            publicId: result.public_id,
            url: result.url,
            secureUrl: result.secure_url,
            originalFilename: originalName,
            bytes: result.bytes,
            format: result.format,
            resourceType: result.resource_type,
          });
        }
      );

      const stream = this.bufferToStream(buffer);
      stream.pipe(uploadStream);
    });
  }

  async uploadProfilePhoto(
    buffer: Buffer,
    originalName: string,
    userId: number
  ): Promise<FileUploadResult> {
    return this.uploadToCloudinary(buffer, 'profiles/photos', originalName, {
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto:good' },
        { format: 'jpg' },
      ],
      public_id: `profile_photo_${userId}_${Date.now()}`,
    });
  }

  async uploadIdDocument(
    buffer: Buffer,
    originalName: string,
    userId: number
  ): Promise<FileUploadResult> {
    return this.uploadToCloudinary(buffer, 'profiles/documents', originalName, {
      resource_type: 'auto',
      public_id: `id_document_${userId}_${Date.now()}`,
      access_mode: 'authenticated',
    });
  }

  async uploadOrganizationLogo(
    buffer: Buffer,
    originalName: string,
    organizationId: number
  ): Promise<FileUploadResult> {
    return this.uploadToCloudinary(buffer, 'organizations/logos', originalName, {
      transformation: [
        { width: 200, height: 200, crop: 'fit' },
        { quality: 'auto:good' },
      ],
      public_id: `logo_${organizationId}_${Date.now()}`,
    });
  }

  async deleteFromCloudinary(publicId: string): Promise<void> {
    if (!this.isConfigured) {
      throw new Error('Cloudinary is not properly configured');
    }

    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error: any) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async getFileInfo(publicId: string): Promise<any> {
    if (!this.isConfigured) {
      throw new Error('Cloudinary is not properly configured');
    }

    try {
      return await cloudinary.api.resource(publicId);
    } catch (error: any) {
      throw new Error(`Failed to get file info: ${error.message}`);
    }
  }

  generateSignedUrl(publicId: string, options: any = {}): string {
    if (!this.isConfigured) {
      throw new Error('Cloudinary is not properly configured');
    }

    return cloudinary.url(publicId, {
      sign_url: true,
      ...options,
    });
  }
}

export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;