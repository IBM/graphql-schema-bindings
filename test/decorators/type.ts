import { createSchema, type, field } from "../../src";
import { expect } from "chai";
import TestServer from "../TestServer";

describe("Test @type", () => {
  @type
  class TypeQuery {
    @field(String)
    value() {
      return "test";
    }
  }

  const schema = createSchema(TypeQuery);
  const server = new TestServer(schema);

  it("should be exported", async function() {
    const { body } = await server.query({ query: `query { value }` });
    console.log(body.errors);
    expect(body.errors).to.be.undefined;
    const data = body.data;
    expect(data).to.not.be.undefined;
    expect(data && data.value).to.eq("test");
  });
});
