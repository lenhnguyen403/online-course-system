import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create folder if not exist
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Dynamic folder based on module
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'uploads/misc';

        if (req.baseUrl.includes('users')) {
            folder = 'uploads/avatars';
        }

        if (req.baseUrl.includes('payments')) {
            folder = 'uploads/payments';
        }

        if (req.baseUrl.includes('courses')) {
            folder = 'uploads/classes';
        }

        ensureDir(folder);
        cb(null, folder);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9)

        cb(null, uniqueName + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF are allowed.'), false);
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})