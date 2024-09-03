'use client'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { AwardIcon } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { mintCourseCompletionNFT } from '@/entry-functions/mint_nft'

interface MintNFTProps {
    courseId: string;
    courseName: string;

}
const MintNftButton = ({ courseId, courseName }: MintNFTProps) => {
    const [isMinting, setIsMinting] = useState(false)
    const { signAndSubmitTransaction } = useWallet()

    const handleMintNFT = async () => {
      setIsMinting(true)
      try {
        const transaction = mintCourseCompletionNFT({
          courseId,
          courseName,
        })
        const result = await signAndSubmitTransaction(transaction)
        console.log('Transaction successful', result)
        toast.success('NFT minted successfully!')
      } catch (error) {
        console.error('Error minting NFT', error)
        toast.error('Failed to mint NFT. Please try again.')
      } finally {
        setIsMinting(false)
      }
    }

    return (
      <Button
        onClick={handleMintNFT}
        disabled={isMinting}
        className="flex items-center gap-2"
      >
        <AwardIcon size={16} />
        {isMinting ? 'Minting...' : 'Mint NFT'}
      </Button>
    )
}

export default MintNftButton
