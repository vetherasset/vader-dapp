/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import { getMinterDailyLimits, getMinter } from '../common/ethereum'
import defaults from '../common/defaults'

export const useMinterDailyLimits = (rpc = true, pollInterval = defaults.api.graphql.pollInterval, staleTime = defaults.api.staleTime) => {

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

		const limits = useQuery('dailyLimits', async () => {
			return await getMinterDailyLimits(minter)
		}, {
			staleTime: staleTime,
			enabled: !!minter,
		},
		)

		return limits
	}

}