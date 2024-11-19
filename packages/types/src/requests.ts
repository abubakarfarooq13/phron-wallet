import type {
  GetAccountRequest,
  SetRpcUrlRequest,
  SignAndSendTransactionRequest,
  SignSignerPayloadRequest,
  TransferNativeAssetRequest,
} from './methods';

export type PhronRPCRequest =
  | GetAccountRequest
  | SignSignerPayloadRequest
  | SignAndSendTransactionRequest
  | TransferNativeAssetRequest
  | SetRpcUrlRequest;

export type RequestMethod = PhronRPCRequest['method'];

export type RequestParameters = PhronRPCRequest['params'];

export type WalletEnableRequest = {
  method: 'wallet_enable';
  params: unknown[];
};

export type GetSnapsRequest = {
  method: 'wallet_getSnaps';
};

export type SnapRpcMethodRequest = {
  method: string;
  params: [PhronRPCRequest];
};

export type MetamaskRpcRequest =
  | WalletEnableRequest
  | GetSnapsRequest
  | SnapRpcMethodRequest;
