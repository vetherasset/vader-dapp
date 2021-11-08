import { useEffect, useState } from 'react'
import { useLazyQuery, gql } from '@apollo/client'
import { useWallet } from 'use-wallet'

export const useNftitems = () => {

	const wallet = useWallet()
	const [skip, setSkip] = useState(0)

	const positions = gql`
		query Items(
			$account: String!,
			$first: Int!,
			$skip: Int!,
		) {
			nftitems(
				first: $first,
				skip: $skip,
				orderBy: tokenId,
				orderDirection: desc,
				where: {owner: $account})
			{
				id
				owner {
					address
				}
				token {
					id
				}
				position {
					id
					foreignAsset {
						address
					}
          originalNative
          originalForeign
          creation
          isDeleted
				}
			}
		}
	`
	const [fetch, { data, error, loading }] = useLazyQuery(positions)

	useEffect(() => {
		if(wallet.account) {
			fetch({ variables: {
				account: String(wallet.account).toLocaleLowerCase(),
				first: 10,
				skip: skip,
			} })
		}
	}, [wallet.account, skip])

	return [data?.nftitems, loading, setSkip, fetch, error ]

}