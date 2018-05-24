import TestServer from "../TestServer";
import { type, field, arg, createSchema, required } from "../../src";
import { expect } from "chai";

describe("Test @arg", () => {
  it("should return input argument", async () => {
    @type
    class ArgQuery {
      @field(String)
      name(@arg(String) name) {
        return name;
      }
    }
    const server = new TestServer(createSchema(ArgQuery));
    const value = "test-1";
    const { body } = await server.query({
      query: `{ name(name: "${value}") }`
    });
    expect(body).to.deep.equal({
      data: {
        name: value
      }
    });
  });

  it("should get type info from TypeScript", async () => {
    @type
    class TSArgQuery {
      @field(String)
      name(@arg() name: string) {
        return name;
      }
    }
    const server = new TestServer(createSchema(TSArgQuery));
    const value = "test-2";
    const { body } = await server.query({
      query: `{ name(name: "${value}") }`
    });
    expect(body).to.deep.equal({
      data: {
        name: value
      }
    });
  });

  it("should accept array arguments", async () => {
    @type
    class ArrArgQuery {
      @field([String])
      arr(
        @arg([String])
        names
      ) {
        return names;
      }
    }
    const server = new TestServer(createSchema(ArrArgQuery));
    const value = ["1", "2"];
    const { body } = await server.query({
      query: `{ arr(names: [${value.map(val => `"${val}"`).join(",")}]) }`
    });
    expect(body).to.deep.equal({
      data: {
        arr: value
      }
    });
  });

  it("should throw an error if type is not provided", () => {
    expect(() => {
      @type
      class ThrowArgQuery {
        @field(String)
        name(@arg() test) {
          return test;
        }
      }
      createSchema(ThrowArgQuery);
    }).to.throw(Error, "undefined");
  });

  it("should return 400 if missing required argument", () => {
    @type
    class ReqArgQuery {
      @field(String)
      req(
        @arg(String)
        @required
        name
      ) {
        return name;
      }
    }
    const server = new TestServer(createSchema(ReqArgQuery));
    return server.query({ query: `{ req }` }).expect(400);
  });

  it("should be able to accept a thunk type argument", async () => {
    @type
    class ThunkArgQuery {
      @field(String)
      thunk(
        @arg(() => String)
        name
      ) {
        return name;
      }
    }
    const server = new TestServer(createSchema(ThunkArgQuery));
    const value = "test-7";
    const { body } = await server.query({
      query: `{ thunk(name: "${value}") }`
    });
    expect(body).to.deep.equal({
      data: {
        thunk: value
      }
    });
  });
});
