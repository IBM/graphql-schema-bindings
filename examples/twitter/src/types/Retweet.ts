import Tweet, { ITweet } from "./Tweet";
import { field, type } from "graphql-schema-bindings";

export interface IRetweet extends ITweet {
  retweeted_status: ITweet;
}

@type
export default class Retweet extends Tweet {
  static isRetweet(data: any): data is IRetweet {
    return data.retweeted_status !== undefined;
  }

  @field(() => Tweet)
  retweet: Tweet;

  constructor(data: IRetweet) {
    super(data);
    this.retweet = new Tweet(data.retweeted_status);
  }
}
