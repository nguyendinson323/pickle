import multer from 'multer';
import { Request } from 'express';

// File size limits (in bytes)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const ALLOWED_DOCUMENT_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
const ALLOWED_LOGO_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'];

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const createFileFilter = (allowedTypes: string[]) => {
  return (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
    }
  };
};

// Create multer instances for different file types
export const uploadProfilePhoto = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: createFileFilter(ALLOWED_IMAGE_TYPES)
}).single('profilePhoto');

export const uploadIdDocument = multer({
  storage,
  limits: { fileSize: MAX_DOCUMENT_SIZE },
  fileFilter: createFileFilter(ALLOWED_DOCUMENT_TYPES)
}).single('idDocument');

export const uploadLogo = multer({
  storage,
  limits: { fileSize: MAX_LOGO_SIZE },
  fileFilter: createFileFilter(ALLOWED_LOGO_TYPES)
}).single('logo');

// Combined upload for registration (photo + document)
export const uploadRegistrationFiles = multer({
  storage,
  limits: { fileSize: MAX_DOCUMENT_SIZE },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.fieldname === 'profilePhoto') {
      if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid profile photo type'));
      }
    } else if (file.fieldname === 'idDocument') {
      if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid document type'));
      }
    } else {
      cb(new Error('Unknown field'));
    }
  }
}).fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'idDocument', maxCount: 1 }
]);

// Generic file upload for any type
export const uploadGenericFile = multer({
  storage,
  limits: { fileSize: MAX_DOCUMENT_SIZE }
}).single('file');

// Error handler middleware
export const handleMulterError = (err: any, req: Request, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds limit'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Unexpected file field'
      });
    }
  } else if (err) {
    return res.status(400).json({
      success: false,
      error: err.message || 'File upload error'
    });
  }
  next(err);
};