import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  isUnionType
} from "graphql";
import Metadata from "./Metadata";
import { getEnumType } from "./enum";
import { getUnionType } from "./union";

const outputTypes: any[] = [];

const typeMap = new Map();

export class ID extends String {}
export class Int extends Number {}
export class Float extends Number {}

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

/**
 * In order to allow mixin types we need to be able to skip
 * an entry in the prototype chain.
 * e.g. MyType -> MixinType* -> MyBaseType
 * *: not exported by GraphQL
 */
export function getParent(target) {
  let parent = Object.getPrototypeOf(target);
  while (parent !== Object.prototype && !typeMap.has(parent)) {
    parent = Object.getPrototypeOf(parent);
  }
  return typeMap.get(parent);
}

function getField(target, propertyKey) {
  const metaField = Metadata.for(target, propertyKey);
  const typeRef = metaField.typeRef;
  let typeKey = isThunk(typeRef) ? typeRef() : typeRef;
  if (!typeKey) {
    typeKey = metaField.returnType || metaField.fieldType;
  }
  let isList;
  if (Array.isArray(typeKey)) {
    isList = true;
    typeKey = typeKey[0];
  }
  let returnType = getGraphQLType(typeKey, target, propertyKey);
  if (returnType === undefined) {
    throw new Error(
      `No type defined for ${target.constructor.name}.${propertyKey}`
    );
  }
  if (isList) {
    returnType = new GraphQLList(returnType);
  }
  if (metaField.nonNull) {
    returnType = new GraphQLNonNull(returnType);
  }
  return {
    args: metaField.args,
    deprecationReason: metaField.deprecated,
    description: metaField.description,
    type: returnType,
    ...(Metadata.for(target.constructor).type
      ? {
          resolve: async (root, args, globalContext) => {
            let source = root;
            if (!(root instanceof target.constructor)) {
              source = new target.constructor(root);
            }
            const contextFieldName = Metadata.for(target).context;
            if (contextFieldName) {
              source[contextFieldName] = globalContext;
            }
            let result = await source[propertyKey];
            if (typeof result === "function") {
              const params: any[] = [];
              Object.keys(args).forEach(param => {
                params[getParameterIndex(result, param)] = args[param];
              });
              if (metaField.context !== undefined) {
                params[metaField.context] = globalContext;
              }
              result = await result.apply(source, params);
            }
            return result;
          }
        }
      : {}),
    ...(metaField.channel ? {
      resolve: {
        subscribe: metaField.channel,
      }
    } : {})
  };
}

export function getOwnFields(target) {
  const { fields } = Metadata.for(target);
  return (
    fields &&
    fields.reduce((all, propertyKey) => {
      return {
        ...all,
        ...{ [propertyKey]: getField(target, propertyKey) }
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

function getParams(method: Function) {
  const [, result = ""] = paramsRegex.exec(method.toString()) || [];
  return result.split(",");
}

export function getParameterIndex(method: Function, param: string) {
  return getParams(method)
    .map(name => name.trim())
    .indexOf(param);
}

export function getParameterName(method: Function, index: number) {
  return getParams(method)[index].trim();
}

export function getGraphQLType(typeKey, target, propertyKey) {
  if (isEnumType(typeKey)) {
    return getEnumType(typeKey, target, propertyKey);
  }
  if (isUnionType(typeKey)) {
    return getUnionType(typeKey);
  }
  return (
    (isClass(typeKey) && interfaceTypeMap.get(typeKey)) || typeMap.get(typeKey)
  );
}

export function createSchema(queryType, mutation?, subscription?) {
  return new GraphQLSchema({
    subscription: subscription && typeMap.get(subscription),
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
