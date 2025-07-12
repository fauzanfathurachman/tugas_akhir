const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = file.fieldname;
    const typeDir = path.join(uploadDir, type);
    
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }
    
    cb(null, typeDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'birthCertificate': ['application/pdf', 'image/jpeg', 'image/png'],
    'familyCard': ['application/pdf', 'image/jpeg', 'image/png'],
    'previousDiploma': ['application/pdf', 'image/jpeg', 'image/png'],
    'photo': ['image/jpeg', 'image/png'],
    'healthCertificate': ['application/pdf', 'image/jpeg', 'image/png']
  };

  const fieldType = file.fieldname;
  const allowedMimeTypes = allowedTypes[fieldType] || [];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed for ${fieldType}. Allowed types: ${allowedMimeTypes.join(', ')}`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    files: 5 // Maximum 5 files per request
  }
});

// Specific upload configurations
const uploadSingle = (fieldName) => {
  return upload.single(fieldName);
};

const uploadMultiple = (fieldNames) => {
  return upload.fields(fieldNames.map(name => ({ name, maxCount: 1 })));
};

// Document upload fields
const documentFields = [
  { name: 'birthCertificate', maxCount: 1 },
  { name: 'familyCard', maxCount: 1 },
  { name: 'previousDiploma', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'healthCertificate', maxCount: 1 }
];

const uploadDocuments = upload.fields(documentFields);

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadDocuments,
  documentFields
}; 