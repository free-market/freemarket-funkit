# Free Market Integration Library for FunKit Wallet

This module provides an integration between FunWallet and Free Market.  

## Installation

```bash
npm install -S @freemarket/funkit
```

## Usage

This library extends the definition of `FunWallet` to include an additional method `executeWorkflow` which enables 
the wallet to execute Free Market workflows with a single line of code.  

To use this library, you must first create a `FunWallet` instance as normal.  Then invoke the helper function `addExecuteWorkflow` to add the `executeWorkflow` method to the `FunWallet` instance:

```typescript
import { addExecuteWorkflow } from '@freemarket/funkit'

// create FunWallet instance as normal
const baseFunWallet: FunWallet =  /* omitted for brevity */ 

// add the exececuteWorkflow method to it
const funWallet = addExecuteWorkflow(baseFunWallet)

// now you can use the executeWorkflow method
const workflow: Workflow =  /* omitted for brevity */
const args: Arguments = {}
const result = await funWallet.executeWorkflow(workflow, args)
```
