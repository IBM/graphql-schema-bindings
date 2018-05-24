import { expect } from "chai";
import { createSchema, field, type } from "../src";

describe("Test createSchema", () => {
  it("should throw if a field does not have an output type", () => {
    @type
    class NullTypeQuery {
      @field()
      get name() {
        return "name";
      }
    }

    expect(() => {
      createSchema(NullTypeQuery);
    }).to.throw;
  });
});
