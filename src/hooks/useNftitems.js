import { useEffect } from 'react'
import { useLazyQuery, gql } from '@apollo/client'
import { useWallet } from 'use-wallet'

export const useNftitems = () => {

	const wallet = useWallet()

	const positions = gql`
		query Items($account: String!) {
			nftitems(
				first: 10,
				skip: 0,
				orderBy: id,
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
			fetch({ variables: { account: String(wallet.account).toLocaleLowerCase() } })
		}
	}, [wallet.account])

	return [data?.nftitems, loading, error, fetch ]

}