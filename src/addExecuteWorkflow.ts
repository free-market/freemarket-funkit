import { type Auth, type FunWallet } from '@funkit/core'
import {
  type Workflow,
  type Arguments,
  type ExecutionLog,
  type ExecuteWorkflowOptions,
  executeWorkflow as executeWorkflowHelper,
  type ExecutionEventHandler,
  getChainFromProvider,
} from '@freemarket/client-sdk'
import { FunTransactionExecutor } from './FunTransactionExecutor'

/**
 * A function that executes a workflow.
 * @typedef {function} ExecuteWorkflowFunc
 * @param {WorkFlow} workflow - The workflow to execute.
 * @param {Arguments} [args] - The arguments to pass to the workflow.
 * @param {ExecutionEventHandler} [eventHandler] - The event handler to use for the execution.
 * @returns {Promise<ExecutionLog[]>} - A promise that resolves to an array of execution logs.
 */
type ExecuteWorkflowFunc = (workflow: Workflow, args?: Arguments, eventHandler?: ExecutionEventHandler) => Promise<ExecutionLog[]>

/**
 * An object that contains an executeWorkflow function.
 * @typedef {Object} ExecuteWorkflowMixin
 * @property {ExecuteWorkflowFunc} executeWorkflow - The executeWorkflow function.
 */
interface ExecuteWorkflowMixin {
  executeWorkflow: ExecuteWorkflowFunc
}

/**
 * Adds the `executeWorkflow` method to a `FunWallet` instance.
 * @param {FunWallet} funWallet - The `FunWallet` object to add `executeWorkflow` to.
 * @param {Auth} auth - The authentication object to use for the execution.
 * @param {any} provider - The provider to use for the execution.
 * @returns {(`FunWallet` & `ExecuteWorkflowMixin`) | null} - The FunWallet object with the 
 *   `executeWorkflow` method added, or null if the funWallet or provider is null.
 */
export function addExecuteWorkflow<T extends FunWallet>(
  funWallet: T | null,
  auth: Auth,
  provider: any | undefined
): (T & ExecuteWorkflowMixin) | null {
  if (!funWallet || !provider) {
    return null
  }
  const fw = funWallet as T & ExecuteWorkflowMixin
  if (!fw.executeWorkflow) {

    // the function to be append to the funWallet object
    const executeWorkflow = async (workflow: Workflow, args?: Arguments, handler?: ExecutionEventHandler) => {
      const userAddress = await funWallet.getAddress()
      const startChain = await getChainFromProvider(provider)
      const executeWorkflowOptions: ExecuteWorkflowOptions = {
        workflow,
        userAddress,
        providers: provider,
        executors: new FunTransactionExecutor(funWallet, auth, provider),
        handler,
        args,
        startChain,
      }
      return executeWorkflowHelper(executeWorkflowOptions)
    }

    // append the function to the funWallet object
    executeWorkflow.bind(funWallet)
    fw.executeWorkflow = executeWorkflow
  }

  return fw
}
