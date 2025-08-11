const { gql } = require("apollo-server-express");
const receiptSchema = require("./receiptSchema");
const userSchema = require("./userSchema");

const baseSchema = gql`
  type Query
  type Mutation
`;

module.exports = [baseSchema, receiptSchema, userSchema];
