'use client'

import { PropsWithChildren } from 'react'
import { AptosWalletAdapterProvider, Network } from '@aptos-labs/wallet-adapter-react'
import toast from 'react-hot-toast'

import { NETWORK } from '@/constants/constants'

export function WalletProvider({ children }: PropsWithChildren) {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{ network: NETWORK as Network }}
      onError={() => {
        toast.error(
           'Unknown wallet error'
        )
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  )
}
