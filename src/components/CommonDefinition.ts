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

export interface EditeurItem {
    id: string;
    dateCreation: string;
    nomEditeur: string;
}

export enum ContactType {
    TECHNIQUE,
    COMMERCIAL,
}

