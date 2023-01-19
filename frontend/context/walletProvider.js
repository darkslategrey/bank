import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'

const WalletContext = React.createContext(null)

export const WalletProvider = ({children}) => {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [chainId, setChainId] = useState(null)

  let currentAccount = null

  // Event metamask
  useEffect(() => {
    ethereum.on('accountsChanged', handleAccountsChanged)
    ethereum.on('chainChanged', handleChainChanged)

    return () => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged)
      ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [])

  // Connexion function
  const connect = async () => {
    const provider = await detectEthereumProvider()
    if(provider) {
      startApp(provider)
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      if(chainId.toString() === "0x5") { // Connected to Goerli
        ethereum.request({method: 'eth_requestAccounts'})
                .then(() => { handleAccountsChanged() })
                .catch((err) => {
                  if(err.code === 4001) {
                    // Use reject the connection
                    console.log('Please connect to Metamask')
                  } else {
                    console.log(err)
                  }
                })
      } else {
        console.log('Need to be connected to Goerli')
      }
    } else {
      // use toast here
      console.log('Please install Metamask')
    }
  }

  const startApp = (provider) => {
    // If the provider returned by detectEthereumProvider is not the same as
    // window.ethereum, something is overwriting it, perhaps another wallet.
    if (provider !== window.ethereum) {
      console.error('Do you have multiple wallets installed?');
    }
    // Access the decentralized web!
  }

  const handleChainChanged = () => {
    window.location.reload()
  }

  const handleAccountsChanged = (accounts) => {
    if(accounts.length === 0) {
      console.log('Please connect to Metamask')
      setAccount(null)
      setProvider(null)
      setChainId(null)
      console..log('disconnected')
    } else if(accounts[0] !== currentAccount) {
      currentAccount = accounts[0]
      console.log({currentAccount})
      setAccount(currentAccount)
      // Voir si setProvider(provider) peut fonctionner ?
      setProvider(new ethers.provider.Web3Provider(window.ethereum))
    }
  }

  return (
    <WalletContext.Provider value={{account, provider, chainId, connect, setAccount}}>
      {children}
    </WalletContext.Provider>
  )
}
