import { expect } from "chai";
import { type, field, createSchema } from "../../src";
import TestServer from "../TestServer";

describe("Test enum types", () => {
  it("should be able to return an enum type", async () => {
    enum TestEnum {
      FIRST,
      SECOND
    }

    @type
    class EnumQuery {
      @field(TestEnum)
      get value() {
        return TestEnum.FIRST;
      }
    }

    const server = new TestServer(createSchema(EnumQuery));
    const { body } = await server.query({ query: `{ value }` });
    expect(body).to.deep.equal({
      data: {
        value: TestEnum[TestEnum.FIRST]
      }
    });
  });
});
