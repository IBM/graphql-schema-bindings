# Twitter Sample

This sample shows how GraphQL types can be composed by inheritance.

## Running this sample

To run this sample you first need to install [NodeJS](https://nodejs.org/en/download/) which comes with `npm`. Go to the root of the graphql-schema-bindings project and run this command:

```
npm install
```

Get an application key and secret from twitter at [apps.twitter.com](https://apps.twitter.com/).

Create a _.env_ file in the `examples/twitter` directory.

_.env_

```
TWITTER_KEY=<key from previous step>
TWITTER_SECRET=<secret from previous step>
```

Then navigate to the `examples/twitter` directory and running the following commands:

```
npm install
npm start
```

When the second command completes go to the following URL with your favorite browser: [http://localhost:4000](http://localhost:4000). This will show you the GraphQL playground for our service. We can use this playground to make queries against our service.
