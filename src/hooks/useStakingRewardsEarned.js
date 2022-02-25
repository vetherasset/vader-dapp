/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import { getERC20BalanceOf, getStakingRewardsBalanceOf } from '../common/ethereum'
import defaults from '../common/defaults'

export const useStakingRewardsEarned = (address, rpc = true, pollInterval = defaults.api.graphql.pollInterval, staleTime = defaults.api.staleTime) => {

	if (!rpc) {
		// GQL 2 DO
	}
	else {

		const earned = useQuery(`${defaults.address.stakingRewards}_stakingRewardsEarned_${address}`,
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

		return earned
	}

}