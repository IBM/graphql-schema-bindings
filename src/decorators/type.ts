import Metadata from "../lib/Metadata";
import {
  getAllFields,
  setType,
  setInterface,
  getType,
  addOutputType,
  getParent
} from "../lib/common";
import { GraphQLObjectType, GraphQLInterfaceType } from "graphql";

export default function type(target) {
  const meta = Metadata.for(target);
  const parent = getParent(target);
  const interfaces = parent ? [...parent.getInterfaces()] : [];
  meta.type = true;

  const interfaceTypeDef = new GraphQLInterfaceType({
    description: `Interface for ${target.name}`,
    fields: () => getAllFields(target.prototype),
    name: `I${target.name}`,
    resolveType: value => getType(value && value.constructor).name
  });
  interfaces.push(interfaceTypeDef);
  setInterface(target, interfaceTypeDef);

  const typeDef = new GraphQLObjectType({
    description: meta.description,
    fields: () => getAllFields(target.prototype),
    interfaces,
    name: target.name
  });
  setType(target, typeDef);
  addOutputType(typeDef);
}
