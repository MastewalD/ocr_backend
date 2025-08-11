const { Queue } = require('bullmq');
const connection = { host: '127.0.0.1', port: 6379 }; // your redis config

const ocrQueue = new Queue('ocrQueue', { connection });

module.exports = ocrQueue;
