import { HexString } from '@polkadot/util/types';

export type Result<T> = {
  success: boolean;
} & (
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    }
);

export const isError = <T>(
  result: Result<T>,
): result is { success: false; error: string } => !result.success;

export const isSuccess = <T>(
  result: Result<T>,
): result is { success: true; data: T } => result.success;

export class ResultObject {
  static success<T>(data: T): Result<T> {
    return { success: true, data };
  }

  static error<T>(error: string): Result<T> {
    return { success: false, error };
  }
}

export type GetAccountResult = {
  address: string; // TODO: HexString?
};

export type SignSignerPayloadResult = {
  signature: HexString;
};

export type TransactionInfo = {
  hash: string;
  block: string;
  sender: string;
  destination: string;
  amount: string | number;
  fee: string;
};

export type SignAndSendExtrinsicTransactionResult = {
  transaction: TransactionInfo;
};

export type TransferNativeAssetResult = {
  transaction: TransactionInfo;
};