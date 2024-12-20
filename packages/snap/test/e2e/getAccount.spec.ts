import type { SnapsGlobalObject } from '@metamask/snaps-types';
import { isError } from 'phron-wallet-types';

import { onRpcRequest } from '../../src';
import { PhronService } from '../../src/services/phron';
import type { SnapMock } from '../helpers/snapMock';
import { createMockSnap } from '../helpers/snapMock';

jest
  .spyOn(PhronService, 'init')
  .mockImplementation(async () => Promise.resolve());

describe('getAccount', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeAll(async () => {
    snapMock = await createMockSnap();
    // eslint-disable-next-line no-restricted-globals
    global.snap = snapMock;
  });

  it('should return an account', async () => {
    const result = await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'getAccount',
        params: {},
      },
    }).then(JSON.parse);

    if (isError(result)) {
      throw new Error(result.error);
    }
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });
});
