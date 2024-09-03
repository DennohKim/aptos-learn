'use client'

import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import Image from 'next/image'
import { shortenAddress } from '@/lib/utils'

type nft = {
  current_token_data: {
    token_uri: string
    token_name: string
    description: string
    current_collection: { collection_name: string }
    token_data_id: string
  }
}
// Define the GraphQL query
const GET_USER_NFTS = gql`
  query GetUserNFTs($address: String!) {
    current_token_ownerships_v2(where: { owner_address: { _eq: $address } }) {
      current_token_data {
        collection_id
        current_collection {
          collection_name
          description
          creator_address
          uri
        }
        description
        token_name
        token_data_id
        token_uri
      }
      owner_address
      amount
    }
  }
`

const Badges = () => {
  const { account } = useWallet()
  const { loading, error, data } = useQuery(GET_USER_NFTS, {
    variables: { address: account?.address },
    skip: !account?.address,
  })

  if (!account?.address) {
    return <div>Please connect your wallet to view your badges.</div>
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const userNFTs = data?.current_token_ownerships_v2 || []

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold">Your Minted Badges</h1>
      {userNFTs.length === 0 ? (
        <p>You haven&apos;t minted any badges yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* TODO: Filter NFT by collection */}
          {userNFTs.map((nft: nft, index: number) => {
            const tokenData = nft.current_token_data
            return (
              <div key={index} className="flex flex-col space-y-2 rounded-lg border p-4 shadow-md">
                <div className="h-full">
                  <Image
                    src={tokenData.token_uri}
                    alt={tokenData.token_name}
                    className="mt-2 w-full rounded"
                    width={100}
                    height={100}
                  />
                </div>

                <h2 className="text-lg font-bold">{tokenData.token_name}</h2>
                <p className="text-sm">{tokenData.description}</p>
                <p className="">
                  <span className="font-semibold">Collection:</span> {tokenData.current_collection.collection_name}
                </p>
                <p className="">
                  <span className="font-semibold">Token ID:</span> {shortenAddress(tokenData.token_data_id)}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Badges
