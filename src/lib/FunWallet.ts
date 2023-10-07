import { type Auth, type FunWallet as BaseFunWallet, Operation } from '@funkit/core'
import {
  type Workflow,
  type EvmTransactionExecutor,
  type Arguments,
  type TransactionParams,
  type ExecutionLog,
  type ExecuteWorkflowOptions,
  executeWorkflow as executeWorkflowHelper,
  assert,
} from '@freemarket/client-sdk'
import { useCreateFun as baseUseCreateFun, useConnector, usePrimaryAuth } from '@funkit/react'

type UseCreateFunReturn = Omit<ReturnType<typeof baseUseCreateFun>, 'funWallet'> & {
  funWallet: FunWallet | null
}

type FunWallet = BaseFunWallet & {
  executeWorkflow: (workflow: Workflow, args?: Arguments) => Promise<ExecutionLog[]>
}

type ExecuteWorkflowFunc = FunWallet['executeWorkflow']

export function useCreateFun(): UseCreateFunReturn {
  const ret = baseUseCreateFun() as UseCreateFunReturn
  const [auth] = usePrimaryAuth()

  const {
    connector: { provider },
  } = useConnector({ index: 0, autoConnect: true })

  // const funWallet: any = ret.funWallet;
  const { funWallet, account } = ret

  if (funWallet && account && provider && !funWallet.executeWorkflow) {
    const executeWorkflow: ExecuteWorkflowFunc = async (workflow: Workflow, args?: Arguments) => {
      const userAddress = await funWallet.getAddress()
      const executeWorkflowOptions: ExecuteWorkflowOptions = {
        workflow,
        userAddress,
        providers: provider as any,
        executors: new FunTransactionExecutor(funWallet, auth),
        handler: event => {
          console.log('workflow event:', event)
        },
        args,
      }
      return executeWorkflowHelper(executeWorkflowOptions)
    }
    executeWorkflow.bind(funWallet)
    funWallet.executeWorkflow = executeWorkflow
  }

  //   export async function executeWorkflow(executeWorkflowOptions: ExecuteWorkflowOptions): Promise<void> {

  return ret
}

type Hex = `0x${string}`

class FunTransactionExecutor implements EvmTransactionExecutor {
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
