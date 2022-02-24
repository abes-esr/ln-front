export class NotificationUser {
  constructor(argIndex: number = 0, argMessage = "", argDescription = "") {
    this.index = argIndex;
    this.message = argMessage;
    this.description = argDescription;
  }

  index: number;
  message: string = "";
  description: string = "";
}
export default NotificationUser;
