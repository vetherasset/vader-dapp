import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import { bondTerms } from '../common/ethereum'
import defaults from '../common/defaults'

export const useBondTerms = (bondAddress, rpc = false, pollInterval = defaults.api.graphql.pollInterval, staleTime = defaults.api.staleTime) => {

	if (!rpc) {
		const query = gql`
		query {
			term (
				id: "${String(bondAddress).toLocaleLowerCase()}"
			) {
				controlVariable
				vestingTerm
				minPrice
				maxPayout
				maxDebt
			}
		}
	`

		const terms = useApolloQuery(
			query,
			{
   		pollInterval: pollInterval,
			},
		)

		return terms
	}
	else {

		const terms = useQuery(`${bondAddress}_bondTerms`, async () => {
			if (bondAddress) {
				return await bondTerms(
					bondAddress,
				)
			}
		}, {
			staleTime: staleTime,
		},
		)

		return terms
	}

}