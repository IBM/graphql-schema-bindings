import { createSchema, type, field, ID } from "../../src";
import { expect } from "chai";
import TestServer from "../TestServer";

describe("Test @type", () => {
  it("should be exported", async function() {
    @type
    class TypeQuery {
      @field(String)
      value() {
        return "test";
      }
    }

    const schema = createSchema(TypeQuery);
    const server = new TestServer(schema);

    const { body } = await server.query({ query: `query { value }` });
    expect(body.errors).to.be.undefined;
    const data = body.data;
    expect(data).to.not.be.undefined;
    expect(data && data.value).to.eq("test");
  });

  it("should implement inherited interfaces", async () => {
    @type
    class ParentType {
      @field(ID) id;
    }

    @type
    class ChildType extends ParentType {
      @field() name?: string;
    }

    @type
    class TypeInheritanceQuery {
      @field()
      get test(): ChildType {
        return new ChildType();
      }
    }

    const server = new TestServer(createSchema(TypeInheritanceQuery));
    const { body } = await server.query({
      query: `
        {
          __type(name: "ChildType") {
            interfaces {
              name
            }
          }
        }
      `
    });

    expect(body).to.deep.equal({
      data: {
        __type: {
          interfaces: [
            {
              name: "IParentType"
            },
            {
              name: "IChildType"
            }
          ]
        }
      }
    });
  });
});
