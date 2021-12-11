import { useQuery, gql } from '@apollo/client'
import defaults from '../common/defaults'

export const useUniswapV2Price = (pairAddress, pollInterval = defaults.api.graphql.pollInterval) => {

	const query = gql`
		query {
			pairs (
				where: {
					id: "${pairAddress}"
				}
				) {
					token0Price
					token1Price
				}
		}`

	const { data, error, loading } = useQuery(
		query,
		{
			client: defaults.api.graphql.client.uniswapV2,
   		pollInterval: pollInterval,
		},
	)

	return [data, loading, error]
}