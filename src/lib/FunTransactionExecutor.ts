import { type Auth, type FunWallet } from '@funkit/core'
import { assert, type EvmTransactionExecutor, type TransactionParams } from '@freemarket/client-sdk'

type Hex = `0x${string}`

export class FunTransactionExecutor implements EvmTransactionExecutor {
  funWallet: FunWallet
  auth: Auth
  constructor(funWallet: FunWallet, auth: Auth) {
    this.funWallet = funWallet
    this.auth = auth
  }

  async executeTransaction(params: TransactionParams): Promise<string> {
    const operation = await this.funWallet.createOperation(this.auth, await this.auth.getAddress(), {
      to: params.to as Hex,
      value: params.value as Hex,
      data: params.data as Hex,
    })
    const receipt = await this.funWallet.executeOperation(this.auth, operation)
    assert(receipt.txId)
    return receipt.txId
  }
}
