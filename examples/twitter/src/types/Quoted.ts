import Tweet, { ITweet } from "./Tweet";
import { field, type } from "graphql-schema-bindings";

export interface IQuoted extends ITweet {
  quoted_status: ITweet;
}

@type
export default class Quoted extends Tweet {
  static isQuoted(data: ITweet): data is IQuoted {
    return data.is_quote_status;
  }

  @field(() => Tweet)
  quoted: Tweet;

  constructor(data: IQuoted) {
    super(data);
    this.quoted = new Tweet(data.quoted_status);
  }
}
