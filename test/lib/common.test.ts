import { expect } from "chai";
import { getParameterIndex, getParameterName } from "../../src/lib/common";
import { type, context, field, arg, createSchema } from "../../src";
import TestServer from "../TestServer";

describe("Test common.", () => {
  it("getParameterIndex should return index of parameter", () => {
    expect(getParameterIndex(function(id, name) {}, "name")).to.equal(1);
  });

  it("getParameterIndex should return -1 if not found", () => {
    expect(getParameterIndex(function(id, name) {}, "value")).to.equal(-1);
  });

  it("getParameterIndex should return -1 if no params", () => {
    expect(getParameterIndex(function() {}, "value")).to.equal(-1);
  });

  it("getParameterIndex should return -1 if not a function", () => {
    expect(getParameterIndex(() => {}, "value")).to.equal(-1);
  });

  it("getParameterIndex should handle default values", () => {
    expect(
      getParameterIndex(function(
        id = { name: "test", open: "common" },
        name = "test"
      ) {},
      "name")
    ).to.equal(1);
  });

  it("getParamterName should return name of parameter", () => {
    expect(getParameterName(function(id, name) {}, 1)).to.equal("name");
  });

  it("should be able to add a Mutation type", async () => {
    @type
    class Mutation {
      @context context;

      @field(Boolean)
      add(@arg(String) value) {
        this.context.list.push(value);
      }
    }

    @type
    class Query {
      @context context;

      @field(String)
      last() {
        const list = this.context.list;
        return list[list.length - 1];
      }
    }

    const value = "X Test Mutation";
    const server = new TestServer(createSchema(Query, Mutation), { list: [] });
    await server.query({ query: `mutation { add(value: "${value}") }` });
    const { body } = await server.query({ query: `{ last }` });
    expect(body).to.deep.equal({
      data: {
        last: value
      }
    });
  });

  /**
   * This test causes issues in mocha. Basically, nothing can follow this
   * test because the NullTypeQuery throws an error and all types are
   * exported globally.
   *
   * Jest gets around this by creating a new process for every test file.
   */
  it("should throw if a field does not have an output type", () => {
    expect(() => {
      @type
      class NullTypeQuery {
        @field()
        get name() {
          return "name";
        }
      }
      createSchema(NullTypeQuery);
    }).to.throw();
  });
});
