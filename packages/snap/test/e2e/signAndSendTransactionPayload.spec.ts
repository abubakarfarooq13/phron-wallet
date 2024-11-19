import type { SnapsGlobalObject } from '@metamask/snaps-types';
import type { SignAndSendTransactionRequestParams } from 'phron-wallet-types';
import { isError } from 'phron-wallet-types';

import { onRpcRequest } from '../../src';
import { PhronService } from '../../src/services/phron';
import {
  fakeSignature,
  fakeTransactionInfo,
  fakeTransactionPayload,
} from '../data/mocks';
import type { SnapMock } from '../helpers/snapMock';
import { createMockSnap } from '../helpers/snapMock';

jest
  .spyOn(PhronService, 'init')
  .mockImplementation(async () => Promise.resolve());

describe('signAndSendTransaction', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeAll(async () => {
    snapMock = await createMockSnap();
    // eslint-disable-next-line no-restricted-globals
    global.snap = snapMock;
  });

  it('should sign and send transaction payload', async () => {
    const phronInitSpy = jest.spyOn(PhronService, 'init');
    const phronSignPayload = jest
      .spyOn(PhronService, 'signSignerPayload')
      .mockImplementation(async () => Promise.resolve(fakeSignature));
    const phronSignAndSendSpy = jest
      .spyOn(PhronService, 'sendTransactionWithSignature')
      .mockImplementation(async () => Promise.resolve(fakeTransactionInfo));

    const requestParams: SignAndSendTransactionRequestParams = {
      payload: fakeTransactionPayload,
    };
    const res = await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'signAndSendTransaction',
        params: requestParams,
      },
    }).then(JSON.parse);

    expect(phronInitSpy).toHaveBeenCalled();
    expect(phronSignPayload).toHaveBeenCalled();
    expect(phronSignAndSendSpy).toHaveBeenCalled();

    if (isError(res)) {
      throw new Error(res.error);
    }
    expect(res.success).toBe(true);
    expect(res.data).toEqual({ transaction: fakeTransactionInfo });
  });
});
