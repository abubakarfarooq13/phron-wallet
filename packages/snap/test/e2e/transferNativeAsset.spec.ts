import type { JsonRpcRequest, SnapsGlobalObject } from '@metamask/snaps-types';
import {
  isError,
  type TransferNativeAssetRequestParams,
} from 'phron-wallet-types';

import { onRpcRequest } from '../../src';
import { PhronService } from '../../src/services/phron';
import { fakeTransactionInfo, fakeTransactionPayload } from '../data/mocks';
import type { SnapMock } from '../helpers/snapMock';
import { createMockSnap } from '../helpers/snapMock';

jest
  .spyOn(PhronService, 'init')
  .mockImplementation(async () => Promise.resolve());

describe('transferNativeAsset', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeAll(async () => {
    snapMock = await createMockSnap();
    // eslint-disable-next-line no-restricted-globals
    global.snap = snapMock;
  });

  it('should sign and send a transaction to transfer the native asset', async () => {
    const phronInitSpy = jest.spyOn(PhronService, 'init');
    const makeTransferTxSpy = jest
      .spyOn(PhronService, 'makeTransferTxPayload')
      .mockImplementation(async () => fakeTransactionPayload);
    const phronSignAndSendSpy = jest
      .spyOn(PhronService, 'signAndSendExtrinsicTransaction')
      .mockImplementation(async () => Promise.resolve(fakeTransactionInfo));

    const requestParams: TransferNativeAssetRequestParams = {
      recipient: '5FjvBzjJq6x2',
      amount: '0x0000000',
    };
    const res = await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'transferNativeAsset',
        params: requestParams,
      } as JsonRpcRequest<TransferNativeAssetRequestParams>,
    }).then(JSON.parse);

    expect(phronInitSpy).toHaveBeenCalled();
    expect(makeTransferTxSpy).toHaveBeenCalled();
    expect(phronSignAndSendSpy).toHaveBeenCalled();

    if (isError(res)) {
      throw new Error(res.error);
    }
    expect(res.success).toBe(true);
    expect(res.data).toEqual({ transaction: fakeTransactionInfo });
  });
});
