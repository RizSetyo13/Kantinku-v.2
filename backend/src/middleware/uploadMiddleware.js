const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/menu';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // 1. Sanitasi nama file: ganti spasi jadi dash, buang karakter aneh
    const ext = path.extname(file.originalname).toLowerCase();
    const name = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    cb(null, Date.now() + '-' + name + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const types = /jpeg|jpg|png|webp/;
    const ext = types.test(path.extname(file.originalname).toLowerCase());
    const mime = types.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Hanya diperbolehkan gambar (jpg, png, webp)!'));
  }
});

module.exports = upload;
