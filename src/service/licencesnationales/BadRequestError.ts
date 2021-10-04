import { BaseError } from "@/exception/BaseError";

export class BadRequestError extends BaseError {
  constructor(public message: string) {
    super();
  }
}
