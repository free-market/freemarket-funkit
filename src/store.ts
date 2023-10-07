/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools, persist } from 'zustand/middleware'
import { type ExecutionLog } from '@freemarket/client-sdk'

interface State {
  isWorkflowRunning: boolean
  executionLogs?: ExecutionLog[]
}

interface Actions {
  setWorkflowRunning: (b: boolean) => void
  setExecutionLogs: (executionLogs: ExecutionLog[]) => void
}

export const useDemoAppStore = create(
  devtools(
    immer<State & Actions>(set => ({
      isWorkflowRunning: false,
      setWorkflowRunning(b) {
        set(state => {
          state.isWorkflowRunning = b
        })
      },
      setExecutionLogs(executionLogs) {
        set(state => {
          state.executionLogs = executionLogs
        })
      },
    })),
    { name: 'Demo App' }
  )
)
