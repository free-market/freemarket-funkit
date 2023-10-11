import React, { useCallback } from 'react'
import './dark-mode.css'
import './App.css'

import { WorkflowArgumentsForm } from '@freemarket/args-ui-react'
import { type Arguments, type Workflow } from '@freemarket/client-sdk'
import FunWalletStatus from './FunWalletStatus'

// import Fun from "./Fun";
// import MetaMaskDemo from './WorkflowMetamask'
import MetaMaskUI from './MetamaskUI'
import FunWalletBalances from './FunWalletBalances'
import { useDemoAppStore } from './store'
import { useCreateFun } from './lib/FunWallet'
import WorkflowAssets from './lib/WorkflowAssets'
import SectionContainer from './SectionContainer'
const workflow: Workflow = {
  steps: [
    {
      type: 'wrap-native',
      amount: '{{ startAmount }}',
      source: 'caller',
    },
  ],
  parameters: [
    {
      name: 'startAmount',
      label: 'Amount',
      description: 'The amount you want to wrap',
      type: 'amount',
    },
  ],
}

export default function App() {
  const { isWorkflowRunning, setWorkflowRunning, executionLogs, setExecutionLogs } = useDemoAppStore(state => ({
    isWorkflowRunning: state.isWorkflowRunning,
    setWorkflowRunning: state.setWorkflowRunning,
    setExecutionLogs: state.setExecutionLogs,
    executionLogs: state.executionLogs,
  }))
  const createFun = useCreateFun()
  const { funWallet } = createFun
  console.log('*funWallet*', !!funWallet)
  const handleSubmit = useCallback(
    async (args: Arguments) => {
      console.log('submit', isWorkflowRunning, args)
      console.log('*funWallet*', !!funWallet)
      if (!isWorkflowRunning && funWallet) {
        setWorkflowRunning(true)
        const result = await funWallet.executeWorkflow(workflow, args)
        setWorkflowRunning(false)
        setExecutionLogs(result)
        console.log('result', result)
      }
    },
    [funWallet]
  )

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1>Free Market Example</h1>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            // alignItems: 'center',
            gap: 30,
            padding: 20,
          }}
        >
          <SectionContainer title="Meta Mask">
            <MetaMaskUI />
          </SectionContainer>
          <SectionContainer title="Fun">
            <FunWalletStatus />
          </SectionContainer>
          <SectionContainer title="Workflow Parameters">
            <WorkflowArgumentsForm workflow={workflow} onSubmit={handleSubmit} />
          </SectionContainer>
        </div>
        {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>FunWallet Balances</div>
          <FunWalletBalances />
        </div> */}
      </div>
      <div>
        <div>ExecutionLogs</div>
        {isWorkflowRunning && <div>Running...</div>}
        {!isWorkflowRunning && executionLogs && <pre>{JSON.stringify(executionLogs, null, 4)}</pre>}
        <WorkflowAssets />
      </div>
    </div>
  )
}
