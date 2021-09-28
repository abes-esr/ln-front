import { BaseError } from "@/exception/BaseError";

export class HttpRequestError extends BaseError {
  constructor(
    public status: number,
    public error?: string,
    public path?: string
  ) {
    super();
  }
}
