import { GraphQLEnumType } from "graphql";

const enumTypeMap = new Map();

/**
 * Enums are usually created automatically; however, the name
 * will be generated as TypeName + FieldName + 'Enum' for the first
 * instance referencing the enum.
 * This may not match the name in the code so you can call
 * this function directly to define the enum before it is used.
 */
export function createEnum<T extends { [key: string]: any }>(
  name: string,
  target: T
): T {
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
    createEnum(
      `${target.constructor.name}${propertyKey
        .charAt(0)
        .toUpperCase()}${propertyKey.slice(1)}Enum`,
      typeKey
    );
  }
  return enumTypeMap.get(typeKey);
}
