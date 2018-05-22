import Metadata from "../lib/Metadata";

export default function nonNull(target, propertyKey, index) {
  Metadata.for(target, propertyKey, index).nonNull = true;
}
