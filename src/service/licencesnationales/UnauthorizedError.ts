import { BaseError } from "@/exception/BaseError";

export class UnauthorizedError extends BaseError {
  constructor(public message: string) {
    super();
  }
}
