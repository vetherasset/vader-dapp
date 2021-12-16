import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import defaults from '../common/defaults'
import { bondInfo } from '../common/ethereum'

export const useBondInfo = (bondContractAddress, depositorAddress, rpc = false, pollInterval = defaults.api.graphql.pollInterval, staleTime = defaults.api.staleTime) => {

	if (!rpc) {
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
		const bondInfoQ = useApolloQuery(
			query,
			{
   		pollInterval: pollInterval,
			},
		)

		return bondInfoQ
	}
	else {
		const bondInfoQ = useQuery(`${bondContractAddress}_${depositorAddress}_bondInfo`, async () => {
			if (bondContractAddress && depositorAddress) {
				return await bondInfo(
					bondContractAddress,
					depositorAddress,
				)
			}
		}, {
			staleTime: staleTime,
		},
		)
		return bondInfoQ
	}

}