import { field, ID } from "graphql-schema-bindings";

export default class PaginationInput {
  @field()
  count: number;

  @field(ID)
  since_id?: string;

  constructor(data: Partial<PaginationInput> = {}) {
    this.count = data.count || 100;
    this.since_id = data.since_id;
  }

  /**
   * Map this input type to parameters expected by the API.
   */
  toParams() {
    return {
      count: this.count,
      since_id: this.since_id
    };
  }
}
