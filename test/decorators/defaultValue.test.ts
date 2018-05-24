import { expect } from "chai";
import { defaultValue, type, field, arg, createSchema } from "../../src";
import TestServer from "../TestServer";

describe("Test @defaultValue", () => {
  it("should provide a default value", async () => {
    const random = Math.random();

    @type
    class DefaultValueQuery {
      @field(Number)
      value(
        @arg(Number)
        @defaultValue(random)
        value
      ) {
        return value;
      }
    }

    const server = new TestServer(createSchema(DefaultValueQuery));
    const { body } = await server.query({ query: `{ value }` });
    expect(body).to.deep.equal({
      data: {
        value: random
      }
    });
  });
});
