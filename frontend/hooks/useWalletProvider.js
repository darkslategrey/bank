import { useContext } from 'react'
import WalletContext from '@/context/walletProvider'

const useWalletProvider = () => {
  const context = useContext(WalletContext)

  if(!context) {
    throw new Error('useWalletProvider must be used within a WalletProvider')
  }
  return context
}

export default useWalletProvider
