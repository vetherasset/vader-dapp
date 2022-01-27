/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import { getLocks } from '../common/ethereum'
import defaults from '../common/defaults'
import { useWallet } from 'use-wallet'

export const useLocks = (rpc = false, lockIndex = 0, pollInterval = defaults.api.graphql.pollInterval, staleTime = defaults.api.staleTime) => {

	const wallet = useWallet()

	if (!rpc) {
		const query = gql`
		query {
			locks (
				orderBy: release
				orderDirection: desc
				where: {
					isRemoved: false
					user_contains: "${wallet.account.toLowerCase()}"
				}
			) {
				token
				amount
				release
			}
		}
	`
		const locks = useApolloQuery(
			query,
			{
				pollInterval: pollInterval,
			},
		)

		return locks
	}
	else {

		const locks = useQuery(`locks_${wallet?.account}`, async () => {
			return await getLocks(lockIndex)
		}, {
			staleTime: staleTime,
		},
		)

		return locks
	}

}