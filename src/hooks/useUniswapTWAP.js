/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import { getStaleVaderPrice } from '../common/ethereum'
import defaults from '../common/defaults'

export const useUniswapTWAP = (rpc = true, pollInterval = defaults.api.graphql.pollInterval, staleTime = defaults.api.staleTime) => {

	if (!rpc) {
		// GQL 2 DO
	}
	else {

		const terms = useQuery('getStaleVaderPrice', async () => {
			return await getStaleVaderPrice()
		}, {
			staleTime: staleTime,
		},
		)

		return terms
	}

}