import type { PhronState } from '../../../types/src/index.js';

export class SnapStorage {
  static async load(): Promise<PhronState> {
    return snap.request({
      method: 'snap_manageState',
      params: { operation: 'get' },
    }) as Promise<PhronState>;
  }

  static async save(state: PhronState): Promise<void> {
    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: 'update',
        newState: state,
      },
    });
  }

  static async clear(): Promise<void> {
    await snap.request({
      method: 'snap_manageState',
      params: { operation: 'clear' },
    });
  }
}
