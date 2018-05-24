import { expect } from "chai";
import { type, field, deprecated, createSchema } from "../../src";
import TestServer from "../TestServer";

describe("Test @deprecated", () => {
  it("should mark the field as deprecated", async () => {
    const reason = "X test field is deprecated.";

    @type
    class DeprecatedQuery {
      @field(String)
      @deprecated(reason)
      get test() {
        return "";
      }
    }

    const server = new TestServer(createSchema(DeprecatedQuery));
    const { body } = await server.query({
      query: `
        {
          __type(name: "DeprecatedQuery") {
            fields(includeDeprecated: true) {
              name
              deprecationReason
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
              name: "test",
              deprecationReason: reason
            }
          ]
        }
      }
    });
  });
});
