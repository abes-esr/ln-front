import { LicencesNationalesApiError } from "@/service/licencesnationales/exception/LicencesNationalesApiError";

export class LicencesNationalesBadRequestApiError extends LicencesNationalesApiError {
  constructor(
    public message: string,
    public path?: string,
    public deBugMessage?: string
  ) {
    super(message, path, deBugMessage);
  }
}
