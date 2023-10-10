import React from 'react'
import { useMetaMask } from 'metamask-react'
import { getChainFromId } from '@freemarket/client-sdk'
import { capitalizeFirstLetter, shortAddress } from './utils'
import { assetRefs } from './assetRefs'
import { WalletBalances } from '@freemarket/args-ui-react'
import { type WalletBalancesProps } from '@freemarket/args-ui-react/build/asset/WalletBalances'

function getChainDisplayName(chainId: string | null) {
  if (chainId === null) {
    return ''
  }
  let s = chainId
  if (s.startsWith('0x')) {
    s = s.slice(2)
  }
  const chainNum = parseInt(s, 16)
  let chain = getChainFromId(chainNum)
  if (chainNum === 5) {
    chain += ' (Goerli)'
  }
  return capitalizeFirstLetter(chain)
}

interface Props {
  style?: React.CSSProperties
}

export default function MetaMaskUI({ style }: Props) {
  const { status, connect, account, chainId, ethereum } = useMetaMask()

  if (status === 'initializing') {
    return <div style={style}></div>
  }

  if (status === 'unavailable') {
    return <div style={style}>MetaMask is not available</div>
  }

  if (status === 'notConnected') {
    return (
      <button
        style={style}
        onClick={() => {
          void connect()
        }}
      >
        Connect to MetaMask
      </button>
    )
  }
  if (status === 'connecting') {
    return <div style={style}>Connecting...</div>
  }

  if (status === 'connected') {
    const walletBalancesProps: WalletBalancesProps = {
      stdProvider: ethereum,
      address: account ?? '',
      assetRefs,
      fungibleTokens: [],
      refreshToken: 1,
    }

    return (
      <div style={style}>
        <div style={{ display: 'grid', gridTemplateColumns: 'max-content max-content', gridColumnGap: 10 }}>
          <div>Connected:</div>
          <div>{getChainDisplayName(chainId)}</div>
          <div>Address:</div>
          <div>{account}</div>
        </div>
        <div>Balances</div>
        {account && (
          <div style={{}}>
            <div>Wallet Balances</div>
            <WalletBalances {...walletBalancesProps} />
          </div>
        )}
      </div>
    )
  }
  return null
}
