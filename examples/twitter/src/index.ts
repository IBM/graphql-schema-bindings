import "./lib/config";

import { ApolloServer } from "apollo-server";
import { createSchema } from "graphql-schema-bindings";
import axios from "axios";
import Twitter from "./types/Twitter";
import getAccessToken from "./lib/getAccessToken";

export const server = new ApolloServer({
  schema: createSchema(Twitter),
  context: async () => ({
    client: axios.create({
      baseURL: "https://api.twitter.com/1.1",
      headers: { Authorization: `Bearer ${await getAccessToken()}` }
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
