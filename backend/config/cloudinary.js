const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});



const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folderName = 'products';

    const isVideo = file.mimetype.startsWith('video/');

    return {
      folder: folderName,
      resource_type: isVideo ? "video" : 'image', // 👈 necessary for videos
      allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov'],
      public_id: file.originalname.split('.')[0] // optional
    };
  }
});



const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'product/image',
    allowed_formats: ['png', 'jpg', 'jpeg'],
  }
});

const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'product/video',
    resource_type: 'video',
    allowed_formats: ['mp4'],
  }
});

module.exports = { storage, imageStorage, videoStorage };
