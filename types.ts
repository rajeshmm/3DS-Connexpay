export enum FlowStatus {
  IDLE = 'IDLE',
  TOKENIZING = 'TOKENIZING',
  AUTHENTICATING = 'AUTHENTICATING',
  CHALLENGE_REQUIRED = 'CHALLENGE_REQUIRED',
  FINALIZING = 'FINALIZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface TransactionData {
  amount: number;
  cardNumber: string;
  expDate: string;
  cvv: string;
  cardHolderName: string;
}

export interface Config {
  userName: string;
  merchantGuid: string;
  deviceGuid: string;
  salesUrl: string;
}
