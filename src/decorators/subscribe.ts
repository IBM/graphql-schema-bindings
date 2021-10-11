import Metadata from "../lib/Metadata";

export default function subscribe(channel) {
  return (target, propertyKey?, index?) => {
    Metadata.for(target, propertyKey, index).channel = channel;
  };
}
