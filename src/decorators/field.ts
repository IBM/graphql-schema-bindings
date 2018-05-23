import Metadata from "../lib/Metadata";
import {
  addField,
  isThunk,
  getGraphQLType,
  getParameterIndex
} from "../lib/common";
import { GraphQLList, GraphQLNonNull } from "graphql";

/**
 * Marks the class method or property as a GraphQL field.
 * It will attempt to infer the type from the TypeScript metadata.
 * Note that some types cannot be inferred, such as arrays (returns Array) and promise
 * resolutions (returns Promise). In that case use the @returns decorator.
 */
export default function field(typeRef?) {
  return (target, propertyKey) => {
    addField(target, propertyKey);
    const metaField = Metadata.for(target, propertyKey);
    metaField.field = () => {
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
                if (root === undefined) {
                  source = new target.constructor();
                }
                if (!(source instanceof target.constructor)) {
                  throw new Error(
                    `Expecting source to be type ${
                      target.constructor.name
                    } but received ${source}`
                  );
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
          : {})
      };
    };
  };
}
