import User, { IUser } from "./User";
import { field, type, ID, description } from "graphql-schema-bindings";

/**
 * Interface for the API response data.
 */
export interface ITweet {
  id_str: string;
  text: string;
  user: IUser;
  created_at: string;
  retweet_count: number;
  favorite_count: number;
  is_quote_status: boolean;
}

@type
@description("A Twitter status update (tweet)")
export default class Tweet {
  data: ITweet;

  @field(ID)
  id: string;

  @field()
  text: string;

  @field()
  created_at: string;

  @field()
  retweet_count: number;

  @field()
  favorite_count: number;

  // Due to the circular reference between Tweet and User
  // the resolution of User needs to be deferred (via thunk function).
  @field(() => User)
  get user(): User {
    return new User(this.data.user);
  }

  /**
   * Create an instance of the Tweet output type.
   * @param data Tweet data from the API.
   */
  constructor(data: ITweet) {
    this.data = data;
    this.id = data.id_str;
    this.text = data.text;
    this.created_at = data.created_at;
    this.retweet_count = data.retweet_count;
    this.favorite_count = data.favorite_count;
  }
}
