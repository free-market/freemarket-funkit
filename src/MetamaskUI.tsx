import React from 'react'
import { useMetaMask } from 'metamask-react'
import { getChainFromId } from '@freemarket/client-sdk'
import { capitalizeFirstLetter, shortAddress } from './utils'

function getChainDisplayName(chainId: string | null) {
  if (chainId === null) {
    return ''
  }
  let s = chainId
  if (s.startsWith('0x')) {
    s = s.slice(2)
  }
  const chainNum = parseInt(s, 16)
  const chain = getChainFromId(chainNum)
  return capitalizeFirstLetter(chain)
}

interface Props {
  style?: React.CSSProperties
}

export default function MetaMaskUI({ style }: Props) {
  const { status, connect, account, chainId, ethereum } = useMetaMask()

  if (status === 'initializing') {
    return <div style={style}>...</div>
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
    return (
      <div style={style}>
        Connected {shortAddress(account)} on {getChainDisplayName(chainId)}
      </div>
    )
  }
  return null
}
