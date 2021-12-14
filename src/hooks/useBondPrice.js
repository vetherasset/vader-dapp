import { useQuery, gql } from '@apollo/client'
import defaults from '../common/defaults'

export const useBondPrice = (bondAddress, pollInterval = defaults.api.graphql.pollInterval) => {

	const query = gql`
		query {
			global(id: "${String(bondAddress).toLocaleLowerCase()}_bondPrice") {
				value
			}
		}`

	const { data, error, loading, refetch } = useQuery(
		query,
		{
   		pollInterval: pollInterval,
		},
	)

	return [data, refetch, loading, error]
}
