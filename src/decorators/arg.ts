import { GraphQLList, GraphQLNonNull } from "graphql";
import { getGraphQLType, getParameterName, isThunk } from "../lib/common";
import Metadata from "../lib/Metadata";

export default function arg(returns?) {
  return (target, propertyKey, index) => {
    const metaField = Metadata.for(target, propertyKey);
    const metaArg = Metadata.for(target, propertyKey, index);
    let typeKey = isThunk(returns) ? returns() : returns;
    if (!typeKey) {
      typeKey = metaField.paramTypes[index];
    }
    let isList;
    if (Array.isArray(typeKey)) {
      isList = true;
      typeKey = typeKey[0];
    }
    let typeDef = getGraphQLType(typeKey, target, propertyKey);
    const name = getParameterName(target[propertyKey], index);
    if (typeDef === undefined) {
      throw new Error(
        `Type definition undefined for argument ${name} in method ${
          target.constructor.name
        }.${propertyKey}`
      );
    }
    if (isList) {
      typeDef = new GraphQLList(new GraphQLNonNull(typeDef));
    }
    if (metaArg.nonNull) {
      typeDef = new GraphQLNonNull(typeDef);
    }
    metaField.args = {
      ...(metaField.args || {}),
      [name]: {
        defaultValue: metaArg.defaultValue,
        description: metaArg.description,
        type: typeDef
      }
    };
  };
}
