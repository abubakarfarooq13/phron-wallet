import type { RequestArguments } from '@metamask/providers/dist/BaseProvider';
import type { PhronRPCRequest, Result } from 'phron-wallet-types';
import { getSnapId } from './consts';

const walletRequest = async (requestArgs: RequestArguments): Promise<any> => {
  if (!window.ethereum?.isMetaMask) {
    throw new Error('MetaMask is not available');
  }
  return window.ethereum.request(requestArgs);
};

/**
 * Send a PhronRPCRequest to snap.
 *
 * @param request - The `PhronRPCRequest` request to send.
 * @returns The result of the request.
 * @throws If fails to send the request.
 */
export const sendSnapMethod = async <TData>(
  request: PhronRPCRequest,
): Promise<Result<TData>> =>
  walletRequest({
    method: 'wallet_invokeSnap',
    params: {
      snapId: getSnapId(),
      request,
    },
  }).then(JSON.parse);

/**
 * Connect to snap. Attempts to install the snap if needed.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 * @throws If fails to connect to snap or install the snap.
 */
export const connect = async (
  snapId: string = getSnapId(),
  params?: Record<'version' | string, unknown>,
): Promise<void> => {
  await walletRequest({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Detect if the wallet injecting the ethereum object is Flask.
 *
 * @returns True if the MetaMask version is Flask, false otherwise.
 */
export const isFlask = async (): Promise<boolean> => {
  const provider = window.ethereum;

  try {
    const clientVersion = await provider?.request({
      method: 'web3_clientVersion',
    });

    const isFlaskDetected = (clientVersion as string[])?.includes('flask');

    return Boolean(provider && isFlaskDetected);
  } catch {
    return false;
  }
};

/**
 * Detect if the snap is installed.
 *
 * If a version is provided, it will check if the installed version matches the provided version.
 * If no version is provided, it will check if the snap is installed.
 * If no snapId is provided, it will use the default snapId.
 *
 * @param snapId - The ID of the snap.
 * @param version - The version of the snap.
 * @returns True if the snap is installed, false otherwise.
 */
export const isInstalled = async (
  snapId = getSnapId(),
  version?: string,
): Promise<boolean> => {
  const maybeSnaps = await window?.ethereum?.request({
    method: 'wallet_getSnaps',
  });
  const snaps = (maybeSnaps ?? {}) as Record<string, { version: string }>;
  const isSnapInstalled = Boolean(snaps[snapId]);
  if (isSnapInstalled && version) {
    return snaps[snapId].version === version;
  }
  return isSnapInstalled;
};
