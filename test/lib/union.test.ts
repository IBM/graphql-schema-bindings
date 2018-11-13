import { expect } from "chai";
import { type, field, createSchema, createUnion, Int } from "../../src";
import TestServer from "../TestServer";

@type
class Dog {
  @field(String)
  id;

  @field(String)
  name;
}

@type
class Cat {
  @field(String)
  id;

  @field(Int)
  age;
}
const PetType = createUnion("PetType", [Cat, Dog]);
@type
class UnionQuery {
  @field(PetType)
  get value() {
    const oneDog = new Dog();
    oneDog.id = "dog1";
    oneDog.name = "dog1";
    return oneDog;
  }
}
describe("Test Union types", () => {
  it("should be able to return an union type", async () => {
    const server = new TestServer(createSchema(UnionQuery));
    const { body } = await server.query({
      query: `{ value {...on Dog{name}} }`
    });
    expect(body).to.deep.equal({ data: { value: { name: "dog1" } } });
  });
});
