/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import { getERC20BalanceOf } from '../common/ethereum'
import defaults from '../common/defaults'
import { useWallet } from 'use-wallet'

export const useERC20Balance = (tokenAddress, rpc = true, pollInterval = defaults.api.graphql.pollInterval, staleTime = defaults.api.staleTime) => {

	const wallet = useWallet()

	if (!rpc) {
		// GQL 2 DO
	}
	else {

		const balance = useQuery(`${tokenAddress}_erc20Balanceof_${wallet?.account}`,
			async () => {
				if (wallet?.account && tokenAddress) {
					return await getERC20BalanceOf(
						tokenAddress,
						wallet?.account,
						defaults.network.provider,
					)
				}
			}, {
				staleTime: defaults.api.staleTime,
				enabled: (!!wallet?.account && !!tokenAddress),
			},
		)

		return balance
	}

}