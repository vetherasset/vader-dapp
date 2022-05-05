/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import defaults from '../common/defaults'

export const useAccountPreCommits = (address, first = 1000, skip = 0, pollInterval = defaults.api.graphql.pollInterval) => {

	const query = gql`
	query {
		accounts(
			first: ${first}
			skip: ${skip}
			where: {
				address: "${address}"
			}
		) {
			commit {
				id
				amount
				commitEvent {
					id
					index
					timestamp
				}
				isRemoved
			}
		}
	}`

	const commits = useApolloQuery(
		query,
		{
			pollInterval: pollInterval,
		},
	)

	return commits

}