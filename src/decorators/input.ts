import Metadata from "../lib/Metadata";
import { GraphQLInputObjectType } from "graphql";
import { getAllFields, setType } from "../lib/common";

export default function input(target) {
  const meta = Metadata.for(target);
  const typeDef = new GraphQLInputObjectType({
    description: meta.description,
    fields: () => getAllFields(target.prototype),
    name: target.name
  });
  setType(target, typeDef);
}
