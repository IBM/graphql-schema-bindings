import { createSchema, type, field, ID, scalar, arg } from "../../src";
import { expect } from "chai";
import TestServer from "../TestServer";

describe("test @scalar", () => {
  it("should handle numeric types", async () => {
    @scalar
    class X4 {
      value: number;

      static serialize(identity: X4) {
        return identity.value * 2;
      }

      static parseValue(value: number) {
        return new X4(value * 2);
      }

      constructor(value: number) {
        this.value = value;
      }
    }

    @type
    class NumberQuery {
      @field(X4)
      x4(@arg(X4) value) {
        return value;
      }
    }

    const schema = createSchema(NumberQuery);
    const server = new TestServer(schema);

    const { body } = await server.query({ query: `query { x4(value: 2) }` });
    expect(body.errors).to.be.undefined;
    const data = body.data;
    expect(data).to.not.be.undefined;
    expect(data && data.x4).to.eq(8);
  });

  it("should handle string types", async () => {
    @scalar
    class HelloString {
      value: string;

      static serialize(str: HelloString) {
        return `Hello, ${str.value}`;
      }

      static parseValue(value: string) {
        return new HelloString(value);
      }

      constructor(value: string) {
        this.value = value;
      }
    }

    @type
    class StringQuery {
      @field(HelloString)
      withHello(@arg(HelloString) name) {
        return name;
      }
    }

    const schema = createSchema(StringQuery);
    const server = new TestServer(schema);

    const { body } = await server.query({
      query: `query { withHello(name: "Cory") }`
    });
    expect(body.errors).to.be.undefined;
    const data = body.data;
    expect(data).to.not.be.undefined;
    expect(data && data.withHello).to.eq("Hello, Cory");
  });

  it("should throw error for object types", async () => {
    @scalar
    class ObjectArg {
      value: any;

      static serialize(str: ObjectArg) {
        return `Hello, ${str.value}`;
      }

      static parseValue(value: any) {
        return new ObjectArg(value);
      }

      constructor(value: any) {
        this.value = value;
      }
    }

    @type
    class ObjectQuery {
      @field(ObjectArg)
      fail(@arg(ObjectArg) value) {
        return value;
      }
    }

    const schema = createSchema(ObjectQuery);
    const server = new TestServer(schema);

    const { body } = await server.query({
      query: `query { fail(value: { name: "Cory" }) }`
    });
    expect(body.errors).to.have.lengthOf(1);
  });
});
