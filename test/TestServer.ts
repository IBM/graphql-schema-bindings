import express from "express";
import { ApolloServer } from "apollo-server-express";
import supertest, { SuperTest, Test } from "supertest";

export default class TestServer {
  app: SuperTest<Test>;
  server: ApolloServer;

  constructor(schema, context?) {
    const app = express();
    this.server = new ApolloServer({ schema, context });
    this.server.applyMiddleware({ app, path: "/gql" });
    this.app = supertest(app);
  }

  query(options: { query: string; variables?: any }) {
    return this.app.post("/gql").send(options);
  }
}
