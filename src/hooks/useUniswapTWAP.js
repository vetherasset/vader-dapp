/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import defaults from '../common/defaults'
import { getMinter, getMinterLbt, getStaleVaderPrice } from '../common/ethereum'

export const useUniswapTWAP = (rpc = true, pollInterval = defaults.api.graphql.pollInterval, staleTime = defaults.api.staleTime) => {

	if (!rpc) {
		// GQL 2 DO
	}
	else {

		const { data: minter } = useQuery('minter', async () => {
			return await getMinter()
		}, {
			staleTime: staleTime,
		},
		)

		const { data: lbt } = useQuery('lbt', async () => {
			if (minter) {
				return await getMinterLbt(minter)
			}
		}, {
			staleTime: staleTime,
			enabled: !!minter,
		},
		)

		const twap = useQuery('getStaleVaderPrice', async () => {
			if (lbt) {
				return await getStaleVaderPrice(lbt)
			}
		}, {
			staleTime: staleTime,
			enabled: !!lbt,
		},
		)

		return twap
	}
}