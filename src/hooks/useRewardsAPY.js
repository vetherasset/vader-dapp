/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import { getRewardRate, getVirtualPrice } from '../common/ethereum'
import defaults from '../common/defaults'
import { useUniswapTWAP } from './useUniswapTWAP'
import { useERC20Balance } from '../hooks/useERC20Balance'
import { utils } from 'ethers'

export const useRewardsAPY = (rpc = true, pollInterval = defaults.api.graphql.pollInterval, staleTime = defaults.api.staleTime) => {

	const TWAprice = useUniswapTWAP()
	const balance = useERC20Balance(defaults.address.usdv3crvf, defaults.address.stakingRewards)


	if (!rpc) {
		// GQL 2 DO
	}
	else {

		const virtualPrice = useQuery(`viretualPrice_${defaults.address.usdv3crvf}`,
			async () => {
				return await getVirtualPrice()
			}, {
				staleTime: defaults.api.staleTime,
			},
		)

		const rewardRate = useQuery(`rewardRate_${defaults.address.stakingRewards}`,
			async () => {
				return await getRewardRate()
			}, {
				staleTime: defaults.api.staleTime,
			},
		)

		if (TWAprice?.data &&
			balance?.data &&
			virtualPrice?.data &&
			rewardRate?.data) {

			const year = 31536000
			const tvl = balance?.data?.div(virtualPrice?.data)
			const price = utils.formatEther(TWAprice?.data)
			const rewardRatePerUSDperSecond = utils.formatEther(rewardRate?.data?.div(tvl))

			const APRperYear = Number(rewardRatePerUSDperSecond) * year * Number(price)
			const APYperYear = ((1 + (APRperYear / year)) ** year) - 1

			return APYperYear

		}
	}

}