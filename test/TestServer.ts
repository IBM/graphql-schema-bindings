import express, { Express } from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { json } from 'body-parser';

import supertest, { SuperTest, Test } from "supertest";

export default class TestServer {
  testApp: SuperTest<Test>;
  server: ApolloServer;
  expressApp: Express;
  context: any;

  constructor(schema, context?) {
    this.expressApp = express();
    this.server = new ApolloServer({ schema });
    this.testApp = supertest(this.expressApp);
    this.context = context;
  }

  async query(options: { query: string; variables?: any }) {
    try {
      this.server.assertStarted('');
    } catch (err) {
      await this.server.start();
      this.expressApp.use(
        "/gql",
        cors(),
        json(),
        expressMiddleware(this.server,{ context: () => (this.context)}),
      )
    }
    return this.testApp.post("/gql").send(options);
  }
}
