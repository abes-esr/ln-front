import { BaseError } from "@/exception/BaseError";

export class CredentialNotValidError extends BaseError {
  constructor(public message: string) {
    super();
  }
}
