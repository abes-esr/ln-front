import { BaseError } from "@/exception/BaseError";

export class SirenNotFoundError extends BaseError {
  constructor(public message: string) {
    super();
  }
}
