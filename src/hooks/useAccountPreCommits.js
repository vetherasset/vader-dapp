/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import defaults from '../common/defaults'

export const useAccountPreCommits = (address, first = 1000, skip = 0, pollInterval = defaults.api.graphql.pollInterval) => {

	const query = gql`
	query {
		commitEvents(
			first: ${first}
			skip: ${skip}
			orderBy: timestamp
			orderDirection: desc
			where: {
				depositor: "${address}"
			}
		)
		{
			id
			amount
			index
			timestamp
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