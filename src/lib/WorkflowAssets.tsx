import React from 'react'
import { AssetAmountView, AssetView } from '@freemarket/args-ui-react'
import { type AssetReference } from '@freemarket/client-sdk'
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WorkflowAssetsProps {}

export default function WorkflowAssets(props: WorkflowAssetsProps) {
  const assetRefNative: AssetReference = {
    type: 'native',
  }
  const assetRefToken: AssetReference = {
    type: 'fungible-token',
    symbol: 'WETH',
  }

  return (
    <div>
      <div>Workflow Assets</div>
      <AssetView assetRef={assetRefNative} chain={'arbitrum'} />
      <AssetView assetRef={assetRefToken} chain={'arbitrum'} />
      <AssetAmountView assetRef={assetRefToken} chain={'arbitrum'} amount={'1000000000000000000'} />
    </div>
  )
}
