import { config } from "dotenv";
config();

import { ApolloServer } from "apollo-server";
import { createSchema } from "graphql-schema-bindings";
import axios from "axios";
import Twitter from "./Twitter";
import getToken from "./lib/getToken";

const { TWITTER_KEY, TWITTER_SECRET } = process.env;
if (!TWITTER_KEY || !TWITTER_SECRET) {
  throw new Error(
    "Environment variables must be set: TWITTER_KEY, TWITTER_SECRET."
  );
}

export const server = new ApolloServer({
  schema: createSchema(Twitter),
  context: async () => ({
    client: axios.create({
      baseURL: "https://api.twitter.com/1.1",
      headers: { Authorization: `Bearer ${await getToken()}` }
    }),
    twitter: new Twitter()
  })
});

async function main() {
  const { url } = await server.listen();
  console.log(`Server listening at ${url}`);
}

if (!module.parent) {
  main();
}
