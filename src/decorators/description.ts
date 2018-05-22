import Metadata from "../lib/Metadata";

export default function description(text) {
  return (target, propertyKey, index) => {
    Metadata.for(target, propertyKey, index).description = text;
  };
}
