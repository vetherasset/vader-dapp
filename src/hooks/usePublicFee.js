/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import { getPublicFee } from '../common/ethereum'
import defaults from '../common/defaults'

export const usePublicFee = (rpc = true, pollInterval = defaults.api.graphql.pollInterval, staleTime = defaults.api.staleTime) => {

	if (!rpc) {
		// GQL 2 DO
	}
	else {

		const fee = useQuery('getPublicFee', async () => {
			return await getPublicFee()
		}, {
			staleTime: staleTime,
		},
		)

		return fee
	}

}