import type { Json, OnRpcRequestHandler } from '@metamask/snaps-sdk';
import type { JsonRpcRequest } from '@metamask/utils';
import { initWasm } from '@polkadot/wasm-crypto/initOnlyAsm';
import type { RequestMethod, RequestParameters } from '../../types/src/index.js';
import { ResultObject } from '../../types/src/index.js';

import { PhronService } from './services/phron';
import { SnapService } from './services/snap';
import { StorageService } from './services/storage';

// Catching the error here to make sure that we print the error to the console
// before the snap crashes
// eslint-disable-next-line no-console
initWasm().catch(console.error);

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}: {
  origin: string;
  request: JsonRpcRequest;
}): Promise<Json> => {
  try {
    console.log({ origin, request: JSON.stringify(request) });
    const { method, params } = request;

    console.log('Initiating StorageService');
    await StorageService.init();
    console.log('StorageService initiated');

    console.log('Initiating PhronService');
    await PhronService.init();
    console.log('PhronService initiated');

    return await SnapService.handleRpcRequest(
      origin,
      method as RequestMethod,
      params as RequestParameters,
    ).then(JSON.stringify);
  } catch (error) {
    return JSON.stringify(ResultObject.error((error as Error).toString()));
  }
};
