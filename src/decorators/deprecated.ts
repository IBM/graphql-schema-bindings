import Metadata from "../lib/Metadata";

/**
 * Mark the field as deprecated.
 */
export default function deprecated(reason) {
  return (target, propertyKey) => {
    Metadata.for(target, propertyKey).deprecated = reason;
  };
}
