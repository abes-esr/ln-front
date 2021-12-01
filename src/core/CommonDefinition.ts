/**
 * Définitions des structures de données communes
 */

export enum Action {
  CREATION,
  MODIFICATION
}

export interface SegmentPlage {
  length: number;
  value: string;
}

export enum ContactType {
  TECHNIQUE,
  COMMERCIAL
}

export interface ConfirmPopupOptions {
  color: string;
  width: number;
}

export enum MessageType {
  ERREUR,
  INFORMATION,
  AVERTISSEMENT
}

export class Message {
  isDisplayed = false;
  isSticky = false;
  isMultiline = true;
  type: MessageType = MessageType.INFORMATION;
  texte = '';
}
