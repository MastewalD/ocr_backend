const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { graphqlUploadExpress } = require("graphql-upload");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const authMiddleware = require("./middleware/auth");
const AppError = require("./errorHandler/appError");
const db = require("./prisma/db")

const typeDefs = require("./graphql/schemas");
const resolvers = require("./graphql/resolvers");
require("dotenv").config();
const PORT = process.env.PORT || 8000;
async function startServer() {
  const app = express();

  app.use(graphqlUploadExpress());
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const userId = authMiddleware(req);
      return { userId };
    },

    formatError: (err) => {
      if (err.originalError instanceof AppError) {
        return {
          message: err.message,
          code: err.originalError.statusCode,
          success: false,
        };
      }
      console.log(err);

      return {
        message: "Internal server error",
        code: 500,
        success: false,
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app });
  await db()

  app.listen(PORT, () => {
    console.log(
      `Server is running at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startServer();
