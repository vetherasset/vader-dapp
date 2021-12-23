import { useQuery } from 'react-query'
import { bondMaxPayout } from '../common/ethereum'
import defaults from '../common/defaults'

export const useBondMaxPayout = (bondAddress, staleTime = defaults.api.staleTime) => {

	const maxPayout = useQuery(`${bondAddress}_maxPayout`, async () => {
		if (bondAddress) {
			return await bondMaxPayout(
				bondAddress,
			)
		}
	}, {
		staleTime: staleTime,
	},
	)

	return maxPayout
}
