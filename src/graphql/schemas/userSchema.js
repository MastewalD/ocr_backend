const { gql } = require("apollo-server-express");

module.exports = gql`
  type AuthPayload {
    token: String!
    message: String!
    user: User!
  }

  type User {
    id: ID!
    email: String!
    name: String
    receipts: [Receipt]
    createdAt: String
  }

  extend type Query {
    users: [User]
    user(id: ID!): User
    hello: String
  }

  extend type Mutation {
    register(email: String!, name: String, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
`;
