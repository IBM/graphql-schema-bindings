# GraphQL Schema Bindings


[![npm](https://img.shields.io/npm/v/graphql-schema-bindings.svg)](https://www.npmjs.com/package/graphql-schema-bindings)
[![Build Status](https://travis-ci.org/IBM/graphql-schema-bindings.svg?branch=master)](https://travis-ci.org/IBM/graphql-schema-bindings)
[![Coverage Status](https://coveralls.io/repos/github/IBM/graphql-schema-bindings/badge.svg?branch=master)](https://coveralls.io/github/IBM/graphql-schema-bindings?branch=master)

GraphQL Schema Bindings is a flexible and scalable GraphQL schema generator that exposes common object oriented patterns to your GraphQL server.

GraphQL Schema Bindings uses decorators to define the necessary metadata to map your native types to GraphQL types.

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

The XKCD example is a great place to start with this project.  It provides a simple schema that can query comics from [XKCD](https://xkcd.com).  Take a look at the example at [examples/xkcd](examples/xkcd).