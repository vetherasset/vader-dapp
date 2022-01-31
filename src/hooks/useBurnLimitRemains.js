/* eslint-disable no-unused-vars */
import { BigNumber } from 'ethers'
import { useQuery } from 'react-query'
import defaults from '../common/defaults'
import { getMinter, getMinterDailyLimits, getCycleBurns } from '../common/ethereum'

export const useBurnLimitRemains = (staleTime = defaults.api.staleTime) => {

	const { data: minter } = useQuery('minter', async () => {
		return await getMinter()
	}, {
		staleTime: staleTime,
	},
	)

	const limits = useQuery('dailyLimits', () => {
		if (minter) {
			return getMinterDailyLimits(minter)
		}
	}, {
		staleTime: staleTime,
		enabled: !!minter,
	},
	)

	const burned = useQuery('cycleBurns', async () => {
		if (minter) {
			return await getCycleBurns(minter)
		}
	}, {
		staleTime: staleTime,
		enabled: !!minter,
	},
	)

	if (limits?.data?.[2] && burned?.data) {
		return [limits?.data?.[2].sub(burned?.data), burned.refetch]
	}

	return [undefined, burned.refetch]
}