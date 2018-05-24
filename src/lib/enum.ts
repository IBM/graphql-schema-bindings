import { GraphQLEnumType } from "graphql";

const enumTypeMap = new Map();

/**
 * Enums are usually created automatically; however, the name
 * will be generated as TypeName + FieldName + 'Enum' for the first
 * instance referencing the enum.
 * This may not match the name in the code so you can call
 * this function directly to define the enum before it is used.
 * @param {string} name
 * @param {T} target
 * @returns {T}
 * @template T
 */
export function createEnumType(name, target) {
  const values = Object.keys(target)
    .filter(key => isNaN(Number(key))) // eslint-disable-line no-restricted-globals
    .reduce(
      (all, key) => ({
        ...all,
        [key]: {
          value: target[key]
        }
      }),
      {}
    );
  const typeDef = new GraphQLEnumType({
    name,
    values
  });
  enumTypeMap.set(target, typeDef);
  return target;
}

export function getEnumType(typeKey, target, propertyKey) {
  if (!enumTypeMap.has(typeKey)) {
    createEnumType(
      `${target.constructor.name}${propertyKey
        .charAt(0)
        .toUpperCase()}${propertyKey.slice(1)}Enum`,
      typeKey
    );
  }
  return enumTypeMap.get(typeKey);
}
