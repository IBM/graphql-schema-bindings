import {
  arg,
  context,
  defaultValue,
  field,
  ID,
  type,
  description
} from "graphql-schema-bindings";
import Tweet, { ITweet } from "./Tweet";
import { TwitterContext } from "./Twitter";
import TimelineInput from "../inputs/TimelineInput";
import makeTweet from "../lib/makeTweet";

export interface IUser {
  id_str: string;
  screen_name: string;
  name: string;
  followers_count: number;
  friends_count: number;
  statuses_count: number;
}

@type
export default class User {
  @field(ID)
  id: string;

  @field()
  screen_name: string;

  @field()
  name: string;

  @field()
  followers_count: number;

  @field()
  friends_count: number;

  @field()
  statuses_count: number;

  @field(() => [Tweet])
  @description("Fetch the Tweet timeline for this user.")
  async timeline(
    @arg(TimelineInput)
    @defaultValue(new TimelineInput())
    args: Partial<TimelineInput>,
    @context context: TwitterContext
  ) {
    // args is a JSON object so map it to an instance of TimelineInput
    const input = new TimelineInput(args);
    const { data } = await context.client.get<ITweet[]>(
      "/statuses/user_timeline",
      { params: { screen_name: this.screen_name, ...input.toParams() } }
    );
    return data.map(makeTweet);
  }

  /**
   * Create an instance of the User output type.
   * @param data The response data from the API.
   */
  constructor(data: IUser) {
    this.id = data.id_str;
    this.screen_name = data.screen_name;
    this.name = data.name;
    this.followers_count = data.followers_count;
    this.friends_count = data.friends_count;
    this.statuses_count = data.statuses_count;
  }
}
