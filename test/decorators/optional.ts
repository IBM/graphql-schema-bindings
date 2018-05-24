import { expect } from "chai";
import {
  input,
  field,
  ID,
  required,
  optional,
  type,
  arg,
  createSchema
} from "../../src";
import TestServer from "../TestServer";

describe("Test @optional", () => {
  it("should be able to mark inherited required properties as optional", async () => {
    @input
    class OptionalBaseInput {
      @field(ID)
      @required
      id?: string;

      @field() name?: string;
    }

    @input
    class OptionalInput extends OptionalBaseInput {
      @optional id;
    }

    @type
    class OptionalQuery {
      @field(String)
      id(@arg() input: OptionalInput) {
        return input.name || input.id;
      }
    }

    const testName = "X Optional Name";
    const server = new TestServer(createSchema(OptionalQuery));
    const { body } = await server.query({
      query: `query optionalTest($input: OptionalInput) { id(input: $input) }`,
      variables: { input: { name: testName } }
    });
    expect(body).to.deep.equal({
      data: {
        id: testName
      }
    });
  });
});
