import { useQuery, gql } from '@apollo/client'
import defaults from '../common/defaults'

export const useBondTerms = (address, pollInterval = defaults.api.graphql.pollInterval) => {

	const query = gql`
		query {
			term (
				id: "${address}"
			) {
				controlVariable
				vestingTerm
				minPrice
				maxPayout
				maxDebt
			}
		}
	`

	const { data, error, loading } = useQuery(
		query,
		{
   		pollInterval: pollInterval,
		},
	)

	return [data, loading, error]
}