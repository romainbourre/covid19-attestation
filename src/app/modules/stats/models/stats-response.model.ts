export interface StatsResponseModel {
  FranceGlobalLiveData: [Global, Daily];
}

export interface MetaData {
  code: string;
  nom: string;
  date: Date;
  source: { nom: string };
  sourceType: string;
}

export class Daily implements MetaData {
  code: string;
  nom: string;
  date: Date;
  source: { nom: string };
  sourceType: string;

  hospitalises: number;
  reanimation: number;
  deces: number;
  gueris: number;
}

export class Global implements MetaData {
  code: string;
  nom: string;
  date: Date;
  source: { nom: string };
  sourceType: string;

  casConfirmes: number;
  deces: number;
  decesEhpad: number;
  hospitalises: number;
  reanimation: number;
  gueris: number;
  casEhpad: number;
  casConfirmesEhpad: number;
  casPossiblesEhpad: number;
}
