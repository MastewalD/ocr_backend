function categorizeReceipt(ocrRawText) {
  const text = ocrRawText.toLowerCase();

  const categories = [
    { name: "Groceries", keywords: ["milk", "bread", "egg", "rice", "condoms", "walmart", "aldi"] },
    { name: "Dining & Restaurants", keywords: ["burger", "coffee", "pizza", "pasta", "mcdonald", "starbucks"] },
    { name: "Electronics & Gadgets", keywords: ["laptop", "phone", "tv", "headphones", "best buy", "apple"] },
    { name: "Clothing & Apparel", keywords: ["shirt", "shoes", "jacket", "nike", "h&m"] },
    { name: "Health & Pharmacy", keywords: ["vitamin", "medicine", "painkiller", "walgreens", "cvs"] },
    { name: "Home & Furniture", keywords: ["sofa", "table", "bed", "ikea"] },
    { name: "Entertainment", keywords: ["ticket", "movie", "game", "cinema", "netflix"] },
    { name: "Travel & Transport", keywords: ["fuel", "ticket", "flight", "shell", "uber"] },
    { name: "Utilities & Bills", keywords: ["electricity", "water", "internet", "at&t"] },
    { name: "Office & Stationery", keywords: ["pen", "paper", "printer", "staples"] },
    { name: "Sports & Outdoors", keywords: ["ball", "tent", "yoga", "decathlon"] },
    { name: "Education", keywords: ["book", "course", "tuition", "bookstore"] },
    { name: "Beauty & Personal Care", keywords: ["lipstick", "shampoo", "cream", "sephora"] },
  ];

  for (const category of categories) {
    if (category.keywords.some(keyword => text.includes(keyword))) {
      return category.name;
    }
  }

  return "Miscellaneous / Other";
}

module.exports = { categorizeReceipt };