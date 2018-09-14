import { input, field } from "graphql-schema-bindings";
import PaginationInput from "./PaginationInput";

@input
export default class TimelineInput extends PaginationInput {
  @field()
  include_retweets: boolean;

  @field()
  include_replies: boolean;

  constructor(data: Partial<TimelineInput> = {}) {
    super(data);
    this.include_retweets = data.include_retweets === false ? false : true;
    this.include_replies = data.include_replies === false ? false : true;
  }

  /**
   * Map this input type to parameters expected by the API.
   */
  toParams() {
    return {
      ...super.toParams(),
      include_rts: this.include_retweets,
      exclude_replies: !this.include_replies
    };
  }
}
