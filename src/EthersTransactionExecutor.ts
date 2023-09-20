import {
  EvmTransactionExecutor,
  TransactionParams,
} from "@freemarket/client-sdk";
import { Signer } from "@ethersproject/abstract-signer";

export class EthersTransactionExecutor implements EvmTransactionExecutor {
  signer: Signer;

  constructor(signer: Signer) {
    this.signer = signer;
  }

  async executeTransaction(params: TransactionParams): Promise<string> {
    const response = await this.signer.sendTransaction({ ...params });
    const receipt = response.wait();
    return receipt as unknown as string;
  }
}
