import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLSchema,
  GraphQLString
} from "graphql";
import Metadata from "./Metadata";

const outputTypes: any[] = [];

const typeMap = new Map();

export class ID {}
export class Int {}
export class Float {}

typeMap.set(Boolean, GraphQLBoolean);
typeMap.set(GraphQLBoolean, GraphQLBoolean);
typeMap.set(Float, GraphQLFloat);
typeMap.set(GraphQLFloat, GraphQLFloat);
typeMap.set(ID, GraphQLID);
typeMap.set(GraphQLID, GraphQLID);
typeMap.set(Int, GraphQLInt);
typeMap.set(GraphQLInt, GraphQLInt);
typeMap.set(GraphQLString, GraphQLString);
typeMap.set(Number, GraphQLFloat);
typeMap.set(String, GraphQLString);

const interfaceTypeMap = new Map();
const enumTypeMap = new Map();

export function isClass(outputType) {
  return !!(typeof outputType === "function" && outputType.name);
}

export function isThunk(outputType) {
  return typeof outputType === "function" && !isClass(outputType);
}

export function isEnumType(inputType) {
  return (
    typeof inputType === "object" &&
    Object.keys(inputType).every(
      key =>
        typeof inputType[key] === "string" || typeof inputType[key] === "number"
    ) &&
    !typeMap.has(inputType)
  );
}

export function getOwnFields(target) {
  const { fields } = Metadata.for(target);
  return (
    fields &&
    fields.reduce((all, propertyKey) => {
      const thunk = Metadata.for(target, propertyKey).field;
      return {
        ...all,
        ...(thunk ? { [propertyKey]: thunk() } : {})
      };
    }, {})
  );
}

export function getAllFields(target) {
  if (target === Object.prototype) {
    return {};
  }
  return {
    ...getAllFields(Object.getPrototypeOf(target)),
    ...getOwnFields(target)
  };
}

/**
 * FIXME: this expression does not account for destructuring or default arguments.
 */
const paramsRegex = /\(([\w\s,]*)\)/;

export function getParameterIndex(method, param) {
  const matches = paramsRegex.exec(method.toString()) || [];
  return (matches[1] || "")
    .split(",")
    .map(name => name.trim())
    .indexOf(param);
}

export function getParameterName(method, index) {
  const matches = paramsRegex.exec(method.toString()) || [];
  return (matches[1] || "").split(",")[index].trim();
}

export function addField(target, propertyKey) {
  const meta = Metadata.for(target);
  if (!meta.fields) {
    meta.fields = [];
  }
  meta.fields.push(propertyKey);
}

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

export function getGraphQLType(typeKey, target, propertyKey) {
  if (isEnumType(typeKey)) {
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
  return (
    (isClass(typeKey) && interfaceTypeMap.get(typeKey)) || typeMap.get(typeKey)
  );
}

export function createSchema(queryType, mutation?) {
  return new GraphQLSchema({
    mutation: mutation && typeMap.get(mutation),
    query: typeMap.get(queryType),
    types: outputTypes
  });
}

export function getType(sourceType) {
  return typeMap.get(sourceType);
}

export function setType(sourceType, type) {
  typeMap.set(sourceType, type);
}

export function setInterface(sourceType, interfaceType) {
  interfaceTypeMap.set(sourceType, interfaceType);
}

export function addOutputType(outputType) {
  outputTypes.push(outputType);
}
