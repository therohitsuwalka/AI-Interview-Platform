import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, uploadDir);

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    },

});

const allowedTypes = [

    "application/pdf",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    "application/msword",

    "text/plain",

];

const fileFilter = (req, file, cb) => {

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(new Error("Only PDF, DOC and DOCX files are allowed."), false);

    }

};

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024,

    },

});

export default upload;