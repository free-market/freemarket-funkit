import { useState, useEffect } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'

export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2)
  return balance
}

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex)
  return chainIdNum
}

interface State {
  accounts: string[]
  balance: string
  chainId: string
}

const ethereum = window.ethereum as any

const MetaMaskDemo = () => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null)
  const [wallet, setWallet] = useState<State | null>(null)

  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      if (accounts.length > 0) {
        updateWallet(accounts)
      } else {
        // if length 0, user is disconnected
        const initialState = { accounts: [], balance: '', chainId: '' }
        setWallet(initialState)
      }
    }

    const refreshChain = (chainId: string) => {
      setWallet(wallet => {
        if (!wallet) {
          return null
        }
        return { ...wallet, chainId }
      })
    }

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true })
      setHasProvider(Boolean(provider))

      if (provider) {
        const accounts = await ethereum.request({ method: 'eth_accounts' })
        refreshAccounts(accounts)
        ethereum.on('accountsChanged', refreshAccounts)
        ethereum.on('chainChanged', refreshChain)
        ethereum.on('chainIdChanged', refreshChain)
      }
    }

    getProvider()

    return () => {
      ethereum?.removeListener('accountsChanged', refreshAccounts)
      ethereum?.removeListener('chainChanged', refreshChain)
      ethereum?.removeListener('chainIdChanged', refreshChain)
    }
  }, [])

  const updateWallet = async (accounts: any) => {
    const balance = formatBalance(
      await ethereum!.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      })
    )
    const chainId = await ethereum!.request({
      method: 'eth_chainId',
    })
    setWallet({ accounts, balance, chainId })
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      setError(false)
      updateWallet(accounts)
    } catch (err: any) {
      setError(true)
      setErrorMessage(err.message)
    } finally {
      setIsConnecting(false)
    }
  }

  const disableConnect = Boolean(wallet) && isConnecting

  return (
    <div className="App">
      {!hasProvider && <div>Web3 provider not installed.</div>}

      {ethereum?.isMetaMask && wallet && wallet.accounts.length < 1 && (
        <button disabled={disableConnect} onClick={handleConnect}>
          Connect MetaMask
        </button>
      )}

      {wallet && wallet.accounts.length > 0 && (
        <>
          <div>Wallet Accounts: {wallet.accounts[0]}</div>
          <div>Wallet Balance: {wallet.balance}</div>
          <div>Hex ChainId: {wallet.chainId}</div>
          <div>Numeric ChainId: {formatChainAsNum(wallet.chainId)}</div>
        </>
      )}
      {error /* New code block */ && (
        <div onClick={() => setError(false)}>
          <strong>Error:</strong> {errorMessage}
        </div>
      )}
    </div>
  )
}

export default MetaMaskDemo
