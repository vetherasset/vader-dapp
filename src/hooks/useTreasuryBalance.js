import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import { bondTreasury, getERC20BalanceOf } from '../common/ethereum'
import defaults from '../common/defaults'

export const useTreasuryBalance = (bondAddress, rpc = false, pollInterval = defaults.api.graphql.pollInterval, staleTime = defaults.api.staleTime) => {

	if (!rpc) {
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

		const { data: treasury } = useApolloQuery(
			treasuryQuery,
	 )

		const address = treasury?.global?.value
		const balance = useApolloQuery(balanceQuery,
			{
				skip: !address,
				variables: { address },
				pollInterval: pollInterval,
			},
		)

		return balance
	}
	else {

		const { data: treasury } = useQuery(`${bondAddress}_bondTreasury`, async () => {
			if (bondAddress) {
				return await bondTreasury(
					bondAddress,
				)
			}
		},
		)

		const address = treasury
		const balance = useQuery(`${address}_treasuryBalance`, async () => {
			if (address) {
				return await getERC20BalanceOf(
					defaults.vader.address,
					address,
					defaults.network.provider,
				)
			}
		}, {
			staleTime: staleTime,
		},
		)
		return balance

	}
}
