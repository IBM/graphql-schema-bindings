# Pegasus GraphQL

Pegasus is a flexible and scalable GraphQL schema generator that exposes common object oriented patterns to your GraphQL server.

Pegasus uses decorators to define the necessary metadata to map your native types to GraphQL types.

Use `@type` to mark a class to be exported to GraphQL.

```javascript
@type
class Resource {
    ...
}
```

Exported types need to have fields that GraphQL can access.

```javascript
@type
class Resource {
  @field(ID) id;
  @field(String) name;
}
```

Fields are automatically inherited from parent types.

```javascript
@type
class BaseResource {
  // context can be bound to a field
  @context context;

  @field(ID)
  get id() {
    return this.data.id;
  }

  constructor(data) {
    this.data = data;
  }
}

@type
class Resource extends BaseResource {
  /**
   * The field return type can be wrapped in a
   * thunk to handle circular dependencies.
   */
  @field(() => Resource)
  parent() {
    return this.context.getParent(this.id);
  }

  /**
   * The return type can be an array of items.
   */
  @field([Resource])
  children() {
    return this.context.getChildren(this.id);
  }
}
```

## XKCD Example

This example uses `request-promise`, `express`, `body-parser` and `apollo-server-express`.

```javascript
@type
class Comic {
  @field(ID)
  get id() {
    return this.number;
  }

  @field(Int)
  get number() {
    return this.data.num;
  }

  @field(String)
  get title() {
    return this.data.title;
  }

  @field(String)
  get image() {
    return this.data.img;
  }

  @field(String)
  get transcript() {
    return this.data.transcript || this.data.alt;
  }

  @field(String)
  get date() {
    return new Date(
      this.data.year,
      this.data.month,
      this.data.day
    ).toLocaleDateString();
  }

  constructor(data) {
    this.data = data;
  }
}

@type
class XKCDQuery {
  @field(Comic)
  async comic(@arg(ID) id) {
    const url = id ? `/${id}` : "";
    const data = await request(`${url}/info.0.json`, {
      baseUrl: "https://xkcd.com",
      json: true
    });
    return new Comic(data);
  }

  @field(Comic)
  latest() {
    return this.comic();
  }

  @field(Comic)
  random() {
    const { number } = this.comic();
    return this.comic(Math.floor(Math.random() * number));
  }
}

const app = express();
app.use("/gql", json(), graphqlExpress({ schema: createSchema(XKCDQuery) }));
app.listen(8080);
```