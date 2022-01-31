/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import { getMinter, getMinterLbt } from '../common/ethereum'
import defaults from '../common/defaults'

export const useMinterLBT = (rpc = true, pollInterval = defaults.api.graphql.pollInterval, staleTime = defaults.api.staleTime) => {


	if (!rpc) {
		// GQL 2 DO
	}
	else {

		const { data: minter } = useQuery('minter', async () => {
			if (minter) {
				return await getMinter()
			}
		}, {
			staleTime: staleTime,
		},
		)

		const address = useQuery('lbt', async () => {
			if (minter) {
				return await getMinterLbt(minter)
			}
		}, {
			staleTime: staleTime,
			enabled: !!minter,
		},
		)

		return address
	}
}