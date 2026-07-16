import fs from "fs";
import mammoth from "mammoth";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const extractResumeText = async (filePath) => {

    const extension = filePath.split(".").pop().toLowerCase();

    if (extension === "pdf") {

        const buffer = fs.readFileSync(filePath);

        const data = await pdfParse(buffer);

        return data.text;

    }

    if (extension === "docx") {

        const result = await mammoth.extractRawText({
            path: filePath,
        });

        return result.value;

    }

    if (extension === "txt") {

        return fs.readFileSync(filePath, "utf-8");

    }

    throw new Error("Unsupported file format");

};