import { expect } from "chai";
import { type, field, createSchema } from "../../src";
import TestServer from "../TestServer";

describe("Test @field", () => {
  it("should export a field on the type", async () => {
    @type
    class FieldExportQuery {
      @field(String)
      get name() {
        return FieldExportQuery.name;
      }
    }

    const server = new TestServer(createSchema(FieldExportQuery));
    const { body } = await server.query({
      query: `
        {
          name
          __type(name: "FieldExportQuery") {
            fields {
              name
            }
          }
        }
      `
    });
    expect(body).to.deep.equal({
      data: {
        name: FieldExportQuery.name,
        __type: {
          fields: [
            {
              name: "name"
            }
          ]
        }
      }
    });
  });

  it("should allow a thunk return type", async () => {
    @type
    class FieldThunkQuery {
      @field(() => String)
      get name() {
        return FieldThunkQuery.name;
      }
    }

    const server = new TestServer(createSchema(FieldThunkQuery));
    const { body } = await server.query({
      query: `
        {
          name
          __type(name: "FieldThunkQuery") {
            fields {
              name
            }
          }
        }
      `
    });
    expect(body).to.deep.equal({
      data: {
        name: FieldThunkQuery.name,
        __type: {
          fields: [
            {
              name: "name"
            }
          ]
        }
      }
    });
  });

  it("should allow another output type as a return type", async () => {
    const testValue = "X FieldTypeRef Value";

    @type
    class FieldTypeRef {
      @field(String)
      get name() {
        return testValue;
      }
    }

    @type
    class FieldTypeQuery {
      @field(FieldTypeRef)
      get ref() {
        return new FieldTypeRef();
      }
    }

    const server = new TestServer(createSchema(FieldTypeQuery));
    const { body } = await server.query({
      query: `
        {
          ref {
            name
          }
          __type(name: "FieldTypeQuery") {
            fields {
              name
              type {
                fields {
                  name
                }
              }
            }
          }
        }
      `
    });
    expect(body).to.deep.equal({
      data: {
        ref: {
          name: testValue
        },
        __type: {
          fields: [
            {
              name: "ref",
              type: {
                fields: [
                  {
                    name: "name"
                  }
                ]
              }
            }
          ]
        }
      }
    });
  });

  it("should get return type from TypeScript", async () => {
    const testValue = "X Field TS Value";
    @type
    class FieldTSQuery {
      @field()
      get name(): string {
        return testValue;
      }
    }

    const server = new TestServer(createSchema(FieldTSQuery));
    const { body } = await server.query({
      query: `
        {
          name
          __type(name: "FieldTSQuery") {
            fields {
              type {
                name
              }
            }
          }
        }
      `
    });
    expect(body).to.deep.equal({
      data: {
        name: testValue,
        __type: {
          fields: [
            {
              type: {
                name: "String"
              }
            }
          ]
        }
      }
    });
  });

  it("should throw an error if return type is not provided", () => {
    expect(() => {
      @type
      class FieldMissingReturnQuery {
        @field()
        get name() {
          return FieldMissingReturnQuery.name;
        }
      }
      createSchema(FieldMissingReturnQuery);
    }).to.throw;
  });

  it("should throw an error if wrong type is returned from a field", async () => {
    @type
    class FieldWrongTypeRef {
      @field(String)
      get name() {
        return FieldWrongTypeRef.name;
      }
    }

    @type
    class FieldWrongTypeQuery {
      @field(FieldWrongTypeRef)
      get ref() {
        return this;
      }
    }

    const server = new TestServer(createSchema(FieldWrongTypeQuery));
    const { body } = await server.query({ query: `{ ref { name } }` });
    expect(body.errors).to.not.be.undefined;
    expect(body.errors).to.have.lengthOf(1);
  });
});
