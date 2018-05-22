import { mockServer } from "graphql-tools";
import { createSchema, type, field } from "../../src";
import { expect } from "chai";

describe("Test @type", () => {
  @type
  class TestType {
    @field(String)
    get name() {
      return "name";
    }
  }

  @type
  class BaseQuery {
    @field(TestType)
    item() {
      return new TestType();
    }
  }

  const schema = createSchema(BaseQuery);
  const mock = mockServer(schema, {
    BaseQuery: () => ({
      item: () => ({
        __typename: "TestType",
        name: "testing"
      })
    })
  });

  it("should be exported", async function() {
    const result = await mock.query(`query { item { name } }`);
    console.log(result.errors);
    expect(result.errors).to.be.undefined;
    const data = result.data;
    expect(data).to.not.be.undefined;
    expect(data && data.item).to.not.be.undefined;
    expect(data && data.item && data.item.name).to.eq("testing");
  });
});
