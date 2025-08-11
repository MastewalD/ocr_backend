const fs = require("fs");
const path = require("path");
const AppError = require("../errorHandler/appError");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif"];
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");


async function validateFile(file) {
  const { createReadStream, filename, mimetype } = await file;

  if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
    throw new AppError(
      "Unsupported file type. Only JPEG, PNG, and GIF are allowed.",
      400
    );
  }

  let totalBytes = 0;
  const stream = createReadStream();

  await new Promise((resolve, reject) => {
    stream.on("data", (chunk) => {
      totalBytes += chunk.length;
      if (totalBytes > MAX_FILE_SIZE) {
        stream.destroy();
        reject(new AppError("File too large. Max size is 5MB.", 400));
      }
    });
    stream.on("end", resolve);
    stream.on("error", reject);
  });

  // Just return the original createReadStream function, NOT a function returning a promise
  return { filename, createReadStream: () => createReadStream() };
}


async function saveFile(filename, createReadStream) {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
  const filePath = path.join(UPLOAD_DIR, filename);

  await new Promise((resolve, reject) => {
    createReadStream()
      .pipe(fs.createWriteStream(filePath))
      .on("finish", resolve)
      .on("error", reject);
  });

  return filePath;
}

module.exports = { validateFile, saveFile };
