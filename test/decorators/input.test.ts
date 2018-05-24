import { expect } from "chai";
import { type, field, input, required, arg, createSchema } from "../../src";
import TestServer from "../TestServer";

describe("Test @input", () => {
  it("should be able to define an input type", async () => {
    @input
    class NameInput {
      @field(String)
      @required
      name;
    }

    @type
    class InputQuery {
      @field(String)
      name(@arg() input: NameInput) {
        return input.name;
      }
    }

    const testName = "X Name Input";
    const server = new TestServer(createSchema(InputQuery));
    const { body } = await server.query({
      query: `query nameQuery($input: NameInput) { name(input: $input) }`,
      variables: { input: { name: testName } }
    });
    expect(body).to.deep.equal({
      data: {
        name: testName
      }
    });
  });
});
