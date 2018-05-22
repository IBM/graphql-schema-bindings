import Metadata from "../lib/Metadata";

export default function defaultValue(value) {
  return (target, propertyKey, index) => {
    Metadata.for(target, propertyKey, index).defaultValue = value;
  };
}
