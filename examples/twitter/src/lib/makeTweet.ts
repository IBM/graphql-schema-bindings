import Tweet, { ITweet } from "../types/Tweet";
import Retweet from "../types/Retweet";

/**
 * Create the correct Tweet instance type based on the data passed
 * from the API.
 * @param data Tweet data from the API.
 */
export default function makeTweet(data: ITweet): Tweet {
  if (Retweet.isRetweet(data)) {
    return new Retweet(data);
  }
  return new Tweet(data);
}
