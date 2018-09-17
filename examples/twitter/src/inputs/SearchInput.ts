import PaginationInput from "./PaginationInput";
import { field, required, input, defaultValue } from "graphql-schema-bindings";

enum ResultType {
  Mixed = "mixed",
  Recent = "recent",
  Popular = "popular"
}

@input
export default class SearchInput extends PaginationInput {
  @field()
  @required
  query?: string;

  @field(ResultType)
  result_type: ResultType;

  constructor(data: Partial<SearchInput> = {}) {
    super(data);
    this.query = data.query;
    this.result_type = data.result_type || ResultType.Mixed;
  }

  toParams() {
    return {
      ...super.toParams(),
      q: this.query,
      result_type: this.result_type
    };
  }
}
