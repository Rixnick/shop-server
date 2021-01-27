import { ApolloServer } from "apollo-server-express";
import fs from "fs";
import path from "path";
// import typeDefs from './schema/typeDefs';
import resolvers from "./resolvers";
import getUser from "./utils/getUser";

const typeDefs = fs
  .readFileSync(path.join(__dirname, "./schema", "schema.graphql"), "utf8")
  .toString();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    //check token from Header
    const token = req.headers.authorization || "";

    //Extract UserId From token
    const userId = getUser(token);
    //console.log('User ID: -->', userId)
    return { userId };
  },
  subscriptions: { path: "/" },
});

export default server;
