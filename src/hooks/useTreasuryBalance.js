import { useQuery, gql } from '@apollo/client'
import defaults from '../common/defaults'

export const useTreasuryBalance = (bondAddress, pollInterval = defaults.api.graphql.pollInterval) => {

	const treasuryQuery = gql`
		query {
			global(
				id: "${String(bondAddress).toLocaleLowerCase()}_treasury")
				{
					value
				}
			}
	`

	const balanceQuery = gql`
		query ($address: String!) {
			balances(
				where: {
					account: $address
					token: "${String(defaults.address.vader).toLocaleLowerCase()}"
				}
			) {
				balance
			}
		}
	`

	const { data: treasury } = useQuery(
		treasuryQuery,
	 )

	const address = treasury?.global?.value
	const { data, refetch, error, loading } = useQuery(balanceQuery,
		{
			skip: !address,
			variables: { address },
			pollInterval: pollInterval,
		},
	)

	return [data, refetch, error, loading]

}
