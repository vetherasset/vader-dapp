/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import { getVirtualPrice } from '../common/ethereum'
import defaults from '../common/defaults'
import { useERC20Balance } from './useERC20Balance'

export const useRewardsTVL = (rpc = true, pollInterval = defaults.api.graphql.pollInterval, staleTime = defaults.api.staleTime) => {

	const balance = useERC20Balance(defaults.address.usdv3crvf, defaults.address.stakingRewards)

	if (!rpc) {
		// GQL 2 DO
	}
	else {

		const virtualPrice = useQuery(`viretualPrice_${defaults.address.usdv3crvf}`,
			async () => {
				return await getVirtualPrice(defaults.address.usdv3crvf)
			}, {
				staleTime: defaults.api.staleTime,
			},
		)

		if (balance?.data &&
			virtualPrice?.data) {

			return balance?.data?.div(virtualPrice?.data)

		}
	}

}