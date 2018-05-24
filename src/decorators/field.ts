import Metadata from "../lib/Metadata";

/**
 * Marks the class method or property as a GraphQL field.
 * It will attempt to infer the type from the TypeScript metadata.
 * Note that some types cannot be inferred, such as arrays (returns Array) and promise
 * resolutions (returns Promise). In that case pass the type as an argument.
 */
export default function field(typeRef?) {
  return (target, propertyKey) => {
    const meta = Metadata.for(target);
    meta.fields = [...(meta.fields || []), propertyKey];
    Metadata.for(target, propertyKey).typeRef = typeRef;
  };
}
