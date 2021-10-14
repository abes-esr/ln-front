import { LicencesNationalesApiError } from "@/service/licencesnationales/exception/LicencesNationalesApiError";

export class LicencesNationalesUnauthorizedApiError extends LicencesNationalesApiError {
  constructor(
    public message: string,
    public path?: string,
    public deBugMessage?: string
  ) {
    super(message);
  }
}
