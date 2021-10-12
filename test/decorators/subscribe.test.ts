import { expect } from "chai";
import { type, field, subscribe, createSchema } from "../../src";
import TestServer from "../TestServer";

describe("Test @field", () => {
  it.only("should export a field on the type", async () => {
    @type
    class SubscriptionQuery {
      @field(String)
      @subscribe(() => 'channel')
      name;
    }

    const server = new TestServer(createSchema(SubscriptionQuery));
    const { body } = await server.query({
      query: `
        {
          name
        }
      `
    });
    expect(body).to.deep.equal({
      data: {
        name: null,
      }
    });
  });
});
