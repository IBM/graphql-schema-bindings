# Mutation sample

This sample shows you how to do very simple mutations.  It handles adds, deletes, and list operations.

## Running this sample

To run this sample you first need to install [NodeJS](https://nodejs.org/en/download/) which comes with `npm`.  Go to the root of the graphql-schema-bindings project and run this command:

```
npm install
```

Then switch to the `examples/mutation` directory and running the following commands:

```
npm install
npm start
```

When the second command completes go to the following URL with your favorite browser:  [http://localhost:4000](http://localhost:4000).  This will show you the GraphQL playground for our service.  We can use this playground to make queries against our service.

## Getting all the users

Once you have the playground open you can get all of the users with a simple query:

```javascript
query users {
  	users {
      id
      name
    }
}
```

That will return all of the users like this:

```javascript
{
  "data": {
    "users": [
      {
        "id": "1",
        "name": "alice"
      },
      {
        "id": "2",
        "name": "bob"
      },
      {
        "id": "3",
        "name": "carol"
      }
    ]
  }
}
```

## Adding a user

Next we can use a mutation to add a new user.  The mutation looks like this:

```javascript
mutation add($id: ID!, $name: String!) {
  	add(id: $id, name: $name) {
    	id
    	name
    }
}
```

The mutation is the same for all users and it takes query variables to specify the user we want to add.  Let's add a fourth user named Dave.

```javascript
{
  "id": 3,
  "name": "Dave"
}
```

Our service will return our new user like this:

```javascript
{
  "data": {
    "add": {
      "id": "3",
      "name": "Dave"
    }
  }
}
```

## Deleting a user

The last function of our service is to delete a user.  The delete also uses a mutation.  It looks like this:

```javascript
mutation del($id: ID!) {
  	del(id: $id)
}
```

This is a generic delete mutation.  Let's use the query variables to delete Dave like this:

```javascript
{
  "id": 3
}
```