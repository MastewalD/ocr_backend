// queue/worker.js
const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const { performOCR } = require('../services/ocrService');
const prisma = require('../prisma/client');
const { pubsub } = require("../graphql/resolver"); 
const { categorizeReceipt } = require("../utils/categorize");

const worker = new Worker('ocrQueue', async job => {
  const { filePath } = job.data;
  const receiptData = await performOCR(filePath);

  // Add category before saving
  const category = categorizeReceipt(receiptData);

  const savedReceipt = await prisma.receipt.create({
    data: {
      storeName: receiptData.storeName,
      dateOfPurchase: receiptData.dateOfPurchase,
      totalAmount: receiptData.totalAmount,
      category, // Save category in DB
      items: {
        create: receiptData.items.map(item => ({
          name: item.name,
          price: item.price,
        })),
      },
    },
    include: { items: true },
  });

  return savedReceipt;
});
