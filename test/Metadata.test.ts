import Metadata from "../src/lib/Metadata";

describe("Test Metadata.", () => {
  describe("Test class level metadata.", () => {
    class clazz {}
    const meta = Metadata.for(clazz);

    it("should be able to set a value.", () => {
      const value = Symbol("test value");
      meta.args = value;
      console.assert(meta.args === value);
    });
  });
});
