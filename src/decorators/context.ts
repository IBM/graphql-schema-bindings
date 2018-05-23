import Metadata from "../lib/Metadata";

/**
 * Mark a field on the type or an argument in a method to attach the context to.
 *   target The target prototype.
 * propertyKey Either the field to assign the context to for the type
 *   or the method to which the context will be passed as an argument.
 *   index The index of the argument.
 */
export default function context(target, propertyKey, index?) {
  if (index === undefined) {
    Metadata.for(target).context = propertyKey;
  } else {
    Metadata.for(target, propertyKey).context = index;
  }
}
