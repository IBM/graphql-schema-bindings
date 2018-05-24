import nonNull from "./nonNull";

export default function required(target, propertyKey, index?) {
  nonNull(target, propertyKey, index);
}
