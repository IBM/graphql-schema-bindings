import {
  GraphQLScalarType,
  ValueNode,
  IntValueNode,
  FloatValueNode,
  StringValueNode,
  BooleanValueNode,
  EnumValueNode
} from "graphql";
import { setType } from "../lib/common";
import Metadata from "../lib/Metadata";
import Maybe from "../../node_modules/@types/graphql/tsutils/Maybe";

export interface ScalarTarget {
  new (...args: any[]): any;
  serialize(value: any): any;
  parseValue(value: any): any;
  parseLiteral?(astNode: ValueNode, variables: Maybe<{ [key: string]: any }>);
}

function isValueNode(
  node: ValueNode
): node is
  | IntValueNode
  | FloatValueNode
  | StringValueNode
  | BooleanValueNode
  | EnumValueNode {
  return [
    "IntValue",
    "FloatValue",
    "StringValue",
    "BooleanValue",
    "EnumValue"
  ].includes(node.kind);
}

function isNumberNode(node: ValueNode): node is IntValueNode | FloatValueNode {
  return ["IntValue", "FloatValue"].includes(node.kind);
}

export default function scalar(target: ScalarTarget) {
  const meta = Metadata.for(target);

  function parseLiteral(node: ValueNode) {
    if (!isValueNode(node)) {
      throw new Error(
        `Cannot automatically parse node of type ${
          node.kind
        }. Please provide parseLiteral method for scalar type ${target.name}.`
      );
    }

    if (isNumberNode(node)) {
      return target.parseValue(Number(node.value));
    }

    return target.parseValue(node.value);
  }

  setType(
    target,
    new GraphQLScalarType({
      name: target.name,
      description: meta.description,
      serialize: target.serialize,
      parseValue: target.parseValue,
      parseLiteral: target.parseLiteral || parseLiteral
    })
  );
}
