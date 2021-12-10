import { useQuery, gql } from '@apollo/client'
import defaults from '../common/defaults'

export const useBondInfo = (address, pollInterval = defaults.api.graphql.pollInterval) => {

	const query = gql`
		query {
			bonds(
				where: {
					id: "${address}"
				}
			) {
				payout
				vesting
				lastBlock
			}
		}`

	const { data, error, loading } = useQuery(
		query,
		{
   		pollInterval: pollInterval,
		},
	)

	return [data, loading, error]
}