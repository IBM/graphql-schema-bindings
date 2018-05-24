import { expect } from "chai";
import { description, type, createSchema, field } from "../../src";
import TestServer from "../TestServer";

describe("Test @description", () => {
  it("should set descriptions for types", async () => {
    const typeDescription = "X Type Description";

    @type
    @description(typeDescription)
    class DescribeTypeQuery {
      @field(String)
      get name() {
        return DescribeTypeQuery.name;
      }
    }

    const server = new TestServer(createSchema(DescribeTypeQuery));
    const { body } = await server.query({
      query: `
        {
          __type(name: "DescribeTypeQuery") {
            description
          }
        }
      `
    });
    expect(body).to.deep.equal({
      data: {
        __type: {
          description: typeDescription
        }
      }
    });
  });

  it("should set description for fields", async () => {
    const fieldDescription = "X Field Description";

    @type
    class DescribeFieldQuery {
      @field(String)
      @description(fieldDescription)
      get name() {
        return DescribeFieldQuery.name;
      }
    }

    const server = new TestServer(createSchema(DescribeFieldQuery));
    const { body } = await server.query({
      query: `
        {
          __type(name: "DescribeFieldQuery") {
            fields {
              description
            }
          }
        }
      `
    });
    expect(body).to.deep.equal({
      data: {
        __type: {
          fields: [
            {
              description: fieldDescription
            }
          ]
        }
      }
    });
  });
});
