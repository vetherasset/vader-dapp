/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import { getMinterLbt } from '../common/ethereum'
import defaults from '../common/defaults'

export const useMinterLBT = (rpc = true, pollInterval = defaults.api.graphql.pollInterval, staleTime = defaults.api.staleTime) => {

	if (!rpc) {
		// GQL 2 DO
	}
	else {

		const address = useQuery('lbt', async () => {
			return await getMinterLbt()
		}, {
			staleTime: staleTime,
		},
		)

		return address
	}

}