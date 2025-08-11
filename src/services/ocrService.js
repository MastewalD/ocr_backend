const Tesseract = require("tesseract.js");

function parseReceipt(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const storeName = lines[0] || '';

  const dateMatch = text.match(/\b(\d{1,2}\/\d{1,2}\/\d{2,4})\b/);
  const dateOfPurchase = dateMatch ? dateMatch[1] : null;

  const totalMatch = text.match(/total\s*[£$]?(\d+(\.\d{2})?)/i);
  const totalAmount = totalMatch ? parseFloat(totalMatch[1]) : 0;

  const items = lines
    .filter(line => /x\s*[£$]?\d+(\.\d{2})?/.test(line) || /[£$]\d+(\.\d{2})?/.test(line))
    .map(line => {
      let parts = line.split(/x|£|\$/).map(s => s.trim()).filter(Boolean);
      let name = parts[0] || "";
      let price = parseFloat(parts[1]) || 0;
      return { name, price };
    });

  return { storeName, dateOfPurchase, totalAmount, items ,text};
}

async function performOCR(filePath) {
  const { data: { text } } = await Tesseract.recognize(filePath, "eng");
  return parseReceipt(text);
}

module.exports = {
  performOCR,
};
