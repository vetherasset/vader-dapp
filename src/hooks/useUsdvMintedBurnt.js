/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import defaults from '../common/defaults'

export const useUsdvMintedBurnt = (burnt = false, pollInterval = defaults.api.graphql.pollInterval) => {

	const query = gql`
	query {
		globals(
			orderBy: timestamp
			orderDirection: desc
			first: 1
			where: {
				id_gt: "${burnt ? 'burn' : 'mint'}_${defaults.usdv.address}_Day",
				id_lt: "${burnt ? 'burn' : 'mint'}_${defaults.usdv.address}_Hour"
			}
		) {
			value
			timestamp
		}
	}`

	const amount = useApolloQuery(
		query,
		{
			pollInterval: pollInterval,
			client: defaults.api.graphql.client.vaderProtocolUsdv,
		},
	)

	return amount

}