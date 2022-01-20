/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import { getMinterDailyLimits } from '../common/ethereum'
import defaults from '../common/defaults'

export const useMinterDailyLimits = (rpc = true, pollInterval = defaults.api.graphql.pollInterval, staleTime = defaults.api.staleTime) => {

	if (!rpc) {
		// GQL 2 DO
	}
	else {

		const limits = useQuery('dailyLimits', async () => {
			return await getMinterDailyLimits()
		}, {
			staleTime: staleTime,
		},
		)

		return limits
	}

}