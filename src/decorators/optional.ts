import Metadata from "../lib/Metadata";

export default function optional(target, propertyKey, index?) {
  Metadata.for(target, propertyKey, index).nonNull = false;
}
