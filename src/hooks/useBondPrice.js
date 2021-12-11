import { useQuery, gql } from '@apollo/client'
import defaults from '../common/defaults'

export const useBondPrice = (first = 1, pollInterval = defaults.api.graphql.pollInterval) => {

	const query = gql`
		query {
			bondPriceChangedEvents(
				first: ${first}
			) {
				id
				internalPrice
				debtRatio
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