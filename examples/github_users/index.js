import { ApolloServer } from "apollo-server";
import axios from "axios";
import {
  arg,
  context,
  createSchema,
  description,
  field,
  ID,
  type
} from "graphql-schema-bindings";

/**
 * Our very simple User class just represents the user ID and the name
 */
@type
class User {
  @context
  context;

  @field(ID)
  get id() {
    return this.data.id;
  }
  
  @field(String)
  @description('This is the name of the current user')
  get name() {
    return this.data.name;
  }

  constructor(data) {
    this.data = data;
  }
}

/**
 * This is our query class.  It is the entry point for all queries to our application.
 */
@type
class UserQuery {
  @field(User)
  async user(@arg(ID) id) {
    const url = id ? `/${id}` : "";
    const { data } = await axios.get(`https://api.github.com/users${url}`);
    return new User(data);
  }
}

/**
 * Now we are ready to create our ApolloServer and start listening for requests.
 */
const server = new ApolloServer({
  schema: createSchema(UserQuery),
  context: new UserQuery()
});
server.listen().then(({ url }) => console.log(`Server ready at ${url}`));
