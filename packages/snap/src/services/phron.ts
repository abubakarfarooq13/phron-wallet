import { ApiPromise, HttpProvider } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { HexString } from '@polkadot/util/types';
import type { TransactionInfo, TransactionPayload } from '../../../types/src/index.js';
import type { SignerPayloadJSON } from '@polkadot/types/types';
import { getDefaultAddress, getDefaultKeyringPair } from '../account';
import { showConfirmTransactionDialog } from '../metamask/ui';

export class PhronService {
  public static defaultRpcUrl = 'https://testnet.phron.ai/';

  public static api: ApiPromise;

  private static inner: PhronService;

  private constructor(api: ApiPromise) {
    PhronService.api = api;
  }

  public static get instance(): PhronService {
    if (!this.inner) {
      throw new Error('PhronService has not been initialized');
    }
    return this.inner;
  }

  public static async init(
    rpcUrl: string = PhronService.defaultRpcUrl,
  ): Promise<void> {
    if (this.inner) {
      return;
    }

    const provider = new HttpProvider(rpcUrl);
    const api = await ApiPromise.create({ provider });
    this.inner = new PhronService(api);
  }

  public static async sendTransactionWithSignature(
    txPayload: TransactionPayload,
    signature: HexString,
  ): Promise<TransactionInfo> {
    const sender = await getDefaultAddress();
    const destination = txPayload.payload.address;

    const extrinsic = this.api.createType('Extrinsic', txPayload.transaction);
    extrinsic.addSignature(sender, signature, txPayload.payload);

    const amountJSON = extrinsic.args[1].toJSON();
    if (!amountJSON) {
      throw new Error('Amount is empty');
    }

    const amount = Number(amountJSON.toString());
    const paymentInfo = await this.api.tx.balances
      .transfer(destination, amount)
      .paymentInfo(sender);

    const txHash = await this.api.rpc.author.submitExtrinsic(extrinsic);

    return {
      amount,
      block: txHash.toHex(),
      destination,
      fee: paymentInfo.partialFee.toJSON(),
      hash: extrinsic.hash.toHex(),
      sender,
    };
  }

  public static async signAndSendExtrinsicTransaction(
    txPayload: TransactionPayload,
  ): Promise<TransactionInfo> {
    const signed = await PhronService.signSignerPayload(txPayload.payload);
    return PhronService.sendTransactionWithSignature(txPayload, signed);
  }

  public static async signSignerPayload(
    signerPayload: SignerPayloadJSON,
    showConfirmDialog = true,
  ): Promise<HexString> {
    const keyPair = await getDefaultKeyringPair();

    const extrinsic = this.api.registry.createType(
      'ExtrinsicPayload',
      signerPayload,
      {
        version: signerPayload.version,
      },
    );

    const asHumanReadable = extrinsic.toHuman();
    const confirmation = showConfirmDialog
      ? await showConfirmTransactionDialog(asHumanReadable, keyPair.address)
      : false;

    if (confirmation) {
      const { signature } = extrinsic.sign(keyPair);
      return signature;
    }

    throw new Error('User rejected the signature request');
  }

  public static async makeTransferTxPayload(
    sender: string,
    recipient: string,
    amount: string,
  ): Promise<TransactionPayload> {
    const signedBlock = await this.api.rpc.chain.getBlock();

    const account = await this.api.derive.balances.account(sender);
    const nonce = account.accountNonce;
    const signerOptions = {
      blockHash: signedBlock.block.header.hash,
      era: this.api.createType('ExtrinsicEra', {
        current: signedBlock.block.header.number,
        period: 50,
      }),
      nonce,
    };

    // Define transaction method
    const transaction: SubmittableExtrinsic<'promise'> =
      this.api.tx.balances.transfer(recipient, amount);

    // Create SignerPayload
    const payload = this.api
      .createType('SignerPayload', {
        genesisHash: this.api.genesisHash,
        runtimeVersion: this.api.runtimeVersion,
        version: this.api.extrinsicVersion,
        ...signerOptions,
        address: recipient,
        blockNumber: signedBlock.block.header.number,
        method: transaction.method,
        signedExtensions: [],
        transactionVersion: transaction.version,
      })
      .toPayload();

    return {
      payload,
      transaction: transaction.toHex(),
    };
  }
}
