import { ApolloServer } from "apollo-server";
import axios from "axios";
import {
  arg,
  context,
  createSchema,
  description,
  field,
  ID,
  Int,
  required,
  type,
} from "graphql-schema-bindings";

/*
 * This is our users array.  It acts like a little in memory database for our users
 * server.
 */
const users = [];

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

/*
 * Now that we've define the user class we'll add a few users to
 * our users array.
 */
users.push(new User({
  id: 1,
  name: 'alice',
}));

users.push(new User({
  id: 2,
  name: 'bob',
}));

users.push(new User({
  id: 3,
  name: 'carol',
}));


/**
 * This is our query class.  It is the entry point for all queries to our application.
 */
@type
class UserQuery {
  @context
  context;
  
  @field(User)
  @description('Get a specific user.')
  user(@arg(ID) id) {
    return new User(users[id]);
  }
  
  @field([User])
  @description('Get all of the users in the array.')
  users() {
    return users;
  }
}

/**
 * This is our mutation class.  It makes it possible to make changes to our data.
 */
@type
class UserMutation {
  @context
  context;
  
  @field(User)
  @description('Get a user from the array.')
  add(@arg(ID) @required id, @arg(String) @required name) {
    const user = new User({
      id,
      name,
    });
    users[id] = user;
    return user;
  }
  
  @field(Boolean)
  @description('Delete a user from the array.')
  del(@arg(ID) @required id) {
    if (users[id]) {
      delete users[id];
      return true;
    }
    
    return false;
  }
}

/**
 * Now we are ready to create our ApolloServer and start listening for requests.
 */
const server = new ApolloServer({
  schema: createSchema(UserQuery, UserMutation),
//  context: new UserQuery()
});
server.listen().then(({ url }) => console.log(`Server ready at ${url}`));
