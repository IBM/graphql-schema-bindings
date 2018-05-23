import { expect } from "chai";
import { type, field, arg, context, createSchema } from "../../src";
import TestServer from "../TestServer";

describe("Test @context", () => {
  it("should bind the context to a field.", async () => {
    @type
    class ContextFieldQuery {
      @context context;

      @field(Number)
      getValue(@arg(String) key) {
        return this.context[key];
      }
    }

    const testValue = Math.random();
    const server = new TestServer(createSchema(ContextFieldQuery), {
      testValue
    });
    const { body } = await server.query({
      query: `{ getValue(key: "testValue") }`
    });
    expect(body).to.deep.equal({
      data: {
        getValue: testValue
      }
    });
  });

  it("should bind the context to a parameter.", async () => {
    @type
    class ContextArgQuery {
      @field(Number)
      getValue(@arg(String) key, @context context) {
        return context[key];
      }
    }

    const testValue = Math.random();
    const server = new TestServer(createSchema(ContextArgQuery), {
      testValue
    });
    const { body } = await server.query({
      query: `{ getValue(key: "testValue") }`
    });
    expect(body).to.deep.equal({
      data: {
        getValue: testValue
      }
    });
  });
});
