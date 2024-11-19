import type { PhronConfigrState, PhronWalletState } from 'phron-wallet-types';

import { getEmptyAccountState } from '../../src/services/storage';

const defaultSnapState = (address: string): PhronState => {
  const walletState: Record<string, PhronhWalletState> = {};
  walletState[address] = getEmptyAccountState();

  return {
    v1: {
      walletState,
      currentAccount: address,
      config: {
        domainConfig: {},
      },
    },
  };
};

export const getDefaultSnapState = (address: string): PhronState => {
  const state = structuredClone(defaultSnapState(address));
  return structuredClone(state);
};
