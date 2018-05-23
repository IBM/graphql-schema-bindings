import express from "express";
import { json } from "body-parser";
import { graphqlExpress } from "apollo-server-express";
import supertest, { SuperTest, Test } from "supertest";

export default class TestServer {
  app: SuperTest<Test>;

  constructor(schema, context?) {
    const app = express();
    app.use("/gql", json(), graphqlExpress({ schema, context }));
    this.app = supertest(app);
  }

  query(options: { query: string; variables?: any }) {
    return this.app.post("/gql").send(options);
  }
}
