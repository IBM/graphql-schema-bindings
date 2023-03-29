import { GraphQLUnionType } from "graphql";
import { getType } from "./common";

const unionTypeMap = new Map();

/**
 * this function directly to define the union before it is used.
 * @param {string} name
 * @param types
 */
export function createUnion(name, types) {
  const unionType = new GraphQLUnionType({
    name,
    types: types.map(oneType => {
      return getType(oneType);
    }),
    resolveType: value => {
      const theType = types.find(oneType => {
        return value instanceof oneType;
      });
      return getType(theType).name;
    }
  });
  unionTypeMap.set(unionType, unionType);
  return unionType;
}

export function getUnionType(typeKey) {
  return unionTypeMap.get(typeKey);
}
