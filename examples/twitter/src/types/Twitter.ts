import {
  type,
  field,
  arg,
  ID,
  required,
  context
} from "graphql-schema-bindings";
import User, { IUser } from "./User";
import { AxiosInstance } from "axios";

export interface TwitterContext {
  client: AxiosInstance;
  twitter: Twitter;
}

@type
export default class Twitter {
  @field(User)
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
}
