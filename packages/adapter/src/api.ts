import type {
  GetAccountResult,
  Result,
  SetRpcUrlRequestParams,
  SignAndSendExtrinsicTransactionResult,
  SignAndSendTransactionRequestParams,
  SignSignerPayloadRequestParams,
  SignSignerPayloadResult,
  TransferNativeAssetRequestParams,
  TransferNativeAssetResult,
} from 'phron-wallet-types';

import { sendSnapMethod } from './metamask';

/**
 * Get the account address from snap.
 */
export const getAccount = async (): Promise<Result<GetAccountResult>> =>
  sendSnapMethod({
    method: 'getAccount',
    params: [],
  });

/**
 * Sign and send a transaction payload. Returns the transaction info.
 *
 * @param params - The transaction payload to sign and send.
 */
export const signAndSendExtrinsicTransactionPayload = async (
  params: SignAndSendTransactionRequestParams,
): Promise<Result<SignAndSendExtrinsicTransactionResult>> =>
  sendSnapMethod({
    method: 'signAndSendTransaction',
    params,
  });

/**
 * Sign a transaction payload.
 *
 * @param params - The transaction payload to sign.
 */
export const signSignerPayload = async (
  params: SignSignerPayloadRequestParams,
): Promise<Result<SignSignerPayloadResult>> =>
  sendSnapMethod({
    method: 'signSignerPayload',
    params,
  });

/**
 * Transfer native asset.
 *
 * @param params - The parameters to transfer native asset.
 */
export const transferNativeAsset = async (
  params: TransferNativeAssetRequestParams,
): Promise<Result<TransferNativeAssetResult>> =>
  sendSnapMethod({
    method: 'transferNativeAsset',
    params,
  });

/**
 * Set the RPC URL for the current domain.
 *
 * @param params - The parameters to set the RPC URL.
 */
export const setRpcUrl = async (
  params: SetRpcUrlRequestParams,
): Promise<Result<void>> =>
  sendSnapMethod({
    method: 'setRpcUrl',
    params,
  });
