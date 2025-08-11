const fs = require("fs");

function removeFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete file at ${filePath}:`, err);
        return resolve(false);
      }
      console.log(`File deleted successfully at ${filePath}`);
      resolve(true);
    });
  });
}

module.exports = removeFile;
