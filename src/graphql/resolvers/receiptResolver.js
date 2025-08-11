const { GraphQLUpload } = require("graphql-upload");
const prisma = require("../../prisma/client");
const { performOCR } = require("../../services/ocrService");
const { categorizeReceipt } = require("../../utils/catagorize");
const AppError = require("../../errorHandler/appError");
const handlePrismaError = require("../../errorHandler/errorController");

const { validateFile, saveFile } = require("../../utils/fileValidator");
const { convertToISO } = require("../../utils/dateConverter");
const removeFile = require("../../utils/removeFile");

function handleDBError(err) {
  if (err.code?.startsWith("P")) throw handlePrismaError(err);
  throw err;
}

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    receipts: async (_, { category, page, limit }, context) => {
      if (!context.userId) throw new AppError("Not authenticated", 401);

      const where = { userId: context.userId, ...(category && { category }) };
      const totalCount = await prisma.receipt.count({ where });
      const totalPages = Math.ceil(totalCount / limit);

      const receipts = await prisma.receipt.findMany({
        where,
        include: { items: true, user: true },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        message: "Receipts fetched successfully",
        data: { receipts, totalCount, totalPages, currentPage: page },
      };
    },

    receipt: async (_, { id }, context) => {
      try {
        if (!context.userId) throw new AppError("Not authenticated", 401);
        if (!/^[0-9a-fA-F\-]{36}$/.test(id)) {
          throw new AppError("Invalid id format. Expected a UUID string.", 400);
        }

        const receipt = await prisma.receipt.findFirst({
          where: { id, userId: context.userId },
          include: { items: true, user: true },
        });

        if (!receipt) throw new AppError("Receipt not found", 404);
        return { message: "Receipt fetched successfully", receipt };
      } catch (err) {
        handleDBError(err);
      }
    },
  },

  Mutation: {
    uploadReceipt: async (_, { file }, context) => {
      try {
        if (!context.userId) throw new AppError("Not authenticated", 401);

        // File validation & saving
        const { filename, createReadStream } = await validateFile(file);
        const filePath = await saveFile(filename, createReadStream);

        // OCR & categorization
        const receiptData = await performOCR(filePath);
        const category = categorizeReceipt(receiptData.text) || "Uncategorized";
        const isoDate = convertToISO(receiptData.dateOfPurchase);

        // Save to DB
        const savedReceipt = await prisma.receipt.create({
          data: {
            storeName: receiptData.storeName,
            dateOfPurchase: isoDate,
            totalAmount: receiptData.totalAmount,
            category,
            userId: context.userId,
            items: {
              create: receiptData.items.map(({ name, price }) => ({ name, price })),
            },
          },
          include: { items: true },
        });
             await removeFile(filePath);
        return { message: "Receipt uploaded successfully", receipt: savedReceipt };
      } catch (err) {
        handleDBError(err);
      }
    },
  },
};

module.exports = resolvers;
