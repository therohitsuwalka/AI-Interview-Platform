import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: "AIInterviewPlatform/Profile",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],

    transformation: [
      {
        width: 500,
        height: 500,
        crop: "fill",
        gravity: "face",
      },
    ],
  }),
});

const imageUpload = multer({
  storage,

  limits: {
    fileSize: 2 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {

    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (allowed.includes(file.mimetype)) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "Only JPG, PNG and WEBP images are allowed."
        ),
        false
      );

    }

  },
});

export default imageUpload;