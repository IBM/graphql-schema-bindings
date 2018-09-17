import {
  type,
  field,
  arg,
  ID,
  required,
  context,
  defaultValue,
  description
} from "graphql-schema-bindings";
import User, { IUser } from "./types/User";
import { AxiosInstance } from "axios";
import Tweet, { ITweet } from "./types/Tweet";
import SearchInput from "./inputs/SearchInput";
import makeTweet from "./lib/makeTweet";
import TimelineInput from "./inputs/TimelineInput";

export interface TwitterContext {
  client: AxiosInstance;
  twitter: Twitter;
}

@type
@description("This is the base query for Twitter.")
export default class Twitter {
  @field(User)
  @description("Fetch details for a user by screen name.")
  async user(
    @arg(ID)
    @required
    screen_name: string,
    @context context: TwitterContext
  ) {
    const { data } = await context.client.get<IUser>("/users/show", {
      params: { screen_name }
    });
    return new User(data);
  }

  @field([Tweet])
  @description("Fetch the status timeline for a user by screen name.")
  async user_timeline(
    @arg(ID)
    @required
    screen_name: string,
    @arg(TimelineInput)
    @defaultValue(new TimelineInput())
    input: Partial<TimelineInput>,
    @context context: TwitterContext
  ): Promise<Tweet[]> {
    const args = new TimelineInput(input);
    const { data } = await context.client.get<ITweet[]>(
      "/statuses/user_timeline",
      { params: { screen_name: screen_name, ...args.toParams() } }
    );
    return data.map(makeTweet);
  }

  @field([Tweet])
  async search(
    @arg(SearchInput)
    @required
    @defaultValue(new SearchInput())
    input: Partial<SearchInput>,
    @context context: TwitterContext
  ) {
    const args = new SearchInput(input);
    const { data } = await context.client.get<{ statuses: ITweet[] }>(
      "/search/tweets.json",
      { params: args.toParams() }
    );
    return data.statuses.map(makeTweet);
  }
}
