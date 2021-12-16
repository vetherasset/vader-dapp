import { useQuery, gql } from '@apollo/client'
import defaults from '../common/defaults'

export const useUniswapV2Price = (pairAddress, principalPrice = false, pollInterval = defaults.api.graphql.pollInterval) => {

	const query = gql`
		query {
			pairs (
				where: {
					id: "${String(pairAddress).toLowerCase()}"
				}
				) {
					token0Price
					token1Price
					${principalPrice ? `
					reserve0
					reserve1
					totalSupply
					` : ''}
				}
		}`

	const { data, error, loading } = useQuery(
		query,
		{
			client: defaults.api.graphql.client.uniswapV2,
   		pollInterval: pollInterval,
		},
	)

	if(principalPrice) {
		const tvl = Number((data?.pairs?.[0]?.reserve0) * (data?.pairs?.[0]?.token1Price)) + Number(data?.pairs?.[0]?.reserve1)
		const price = Number((tvl) / (data?.pairs?.[0]?.totalSupply))
		return [price && tvl ? {
			totalValueLocked: tvl,
			principalPrice: price,
		} : undefined, loading, error]
	}
	return [data, loading, error]

}