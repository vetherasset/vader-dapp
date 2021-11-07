import { useEffect } from 'react'
import { useLazyQuery, gql } from '@apollo/client'
import { useWallet } from 'use-wallet'

export const useNftitems = () => {

	const wallet = useWallet()

	const positions = gql`
		query Items($account: String!) {
			nftitems(where: {owner: $account}) {
				id
				owner {
					id
				}
				token {
					id
				}
				tokenId
				position {
					id
					foreignAsset {
						id
					}
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

	return [data?.nftitems, fetch, error, loading]

}