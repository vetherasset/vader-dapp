/* eslint-disable no-unused-vars */
import { BigNumber } from 'ethers'
import { useQuery } from 'react-query'
import defaults from '../common/defaults'
import { getMinter, getMinterDailyLimits, getCycleMints } from '../common/ethereum'

export const useMintLimitRemains = (staleTime = defaults.api.staleTime) => {

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

	const minted = useQuery('cycleMinted', async () => {
		if (minter) {
			return await getCycleMints(minter)
		}
	}, {
		staleTime: staleTime,
		enabled: !!minter,
	},
	)

	if (limits?.data?.[1] && minted?.data) {
		return [limits?.data?.[1].sub(minted?.data), minted.refetch]
	}

	return [undefined, minted.refetch]
}