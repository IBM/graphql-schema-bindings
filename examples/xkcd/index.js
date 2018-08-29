import { ApolloServer } from "apollo-server";
import axios from "axios";
import {
  type,
  field,
  arg,
  ID,
  Int,
  createSchema
} from "graphql-schema-bindings";

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

const server = new ApolloServer({ schema: createSchema(XKCDQuery) });
server.listen().then(({ url }) => console.log(`Server ready at ${url}`));
