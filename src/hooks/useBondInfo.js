import { useQuery, gql } from '@apollo/client'
import defaults from '../common/defaults'

export const useBondInfo = (bondContractAddress, depositorAddress, pollInterval = defaults.api.graphql.pollInterval) => {

	const query = gql`
		query {
			bondInfos (
				where: {
					id: "${String(bondContractAddress).toLocaleLowerCase()}"
					depositor: "${String(depositorAddress).toLocaleLowerCase()}"
				}
			) {
					payout
					vesting
					lastBlock
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