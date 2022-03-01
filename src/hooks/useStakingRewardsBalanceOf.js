/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import { getStakingRewardsBalanceOf } from '../common/ethereum'
import defaults from '../common/defaults'

export const useStakingRewardsBalanceOf = (address, rpc = true, pollInterval = defaults.api.graphql.pollInterval, staleTime = defaults.api.staleTime) => {

	if (!rpc) {
		// GQL 2 DO
	}
	else {

		const balance = useQuery(`${defaults.address.stakingRewards}_stakingRewardsBalanceOf_${address}`,
			async () => {
				if (address) {
					return await getStakingRewardsBalanceOf(
						address,
					)
				}
			}, {
				staleTime: defaults.api.staleTime,
				enabled: (!!address),
			},
		)

		return balance
	}

}