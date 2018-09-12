import { ApolloServer } from "apollo-server";
import axios from "axios";
import {
  arg,
  context,
  createSchema,
  field,
  ID,
  Int,
  type
} from "graphql-schema-bindings";

@type
class Comic {
  /** @type {XKCDQuery} */
  @context
  context;

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

  @field(String)
  get link() {
    return `https://xkcd.com/${this.number}`;
  }

  @field(Comic)
  async previous() {
    return this.context.comic(this.number - 1);
  }

  @field(Comic)
  async next() {
    return this.context.comic(this.number + 1);
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
    const { data } = await axios.get(`https://xkcd.com${url}/info.0.json`);
    return new Comic(data);
  }

  @field(Comic)
  latest() {
    return this.comic();
  }

  @field(Comic)
  async random() {
    const { number } = await this.comic();
    return this.comic(Math.floor(Math.random() * number));
  }
}

const server = new ApolloServer({
  schema: createSchema(XKCDQuery),
  context: new XKCDQuery()
});
server.listen().then(({ url }) => console.log(`Server ready at ${url}`));
