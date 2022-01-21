/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import { getStaleVaderPrice } from '../common/ethereum'
import defaults from '../common/defaults'
import { useMinterLBT } from './useMinterLBT'

export const useUniswapTWAP = (rpc = true, pollInterval = defaults.api.graphql.pollInterval, staleTime = defaults.api.staleTime) => {

	const { data: lbt } = useMinterLBT()

	if (lbt) {
		if (!rpc) {
			// GQL 2 DO
		}
		else {

			const twap = useQuery('getStaleVaderPrice', async () => {
				return await getStaleVaderPrice(lbt)
			}, {
				staleTime: staleTime,
			},
			)

			return twap
		}
	}

}