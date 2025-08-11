const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar Upload
  scalar Date

  type PurchasedItem {
    id: ID!
    name: String!
    price: Float!
  }

  type PaginatedReceipts {
    receipts: [Receipt!]!
    totalCount: Int!
    totalPages: Int!
    currentPage: Int!
  }

  type PaginatedReceiptsResponse {
    message: String!
    data: PaginatedReceipts!
  }

  type ReceiptResponse {
    message: String!
    receipt: Receipt
  }

  type Receipt {
    id: ID!
    storeName: String!
    dateOfPurchase: Date!
    totalAmount: Float!
    category: String
    items: [PurchasedItem!]!
    user: User
  }

  type UploadReceiptResponse {
    message: String!
    receipt: Receipt
  }

  extend type Query {
    receipts(
      category: String
      page: Int!
      limit: Int!
    ): PaginatedReceiptsResponse!
    receipt(id: ID!): ReceiptResponse!
  }

  extend type Mutation {
    uploadReceipt(file: Upload!, category: String): UploadReceiptResponse!
  }
`;
