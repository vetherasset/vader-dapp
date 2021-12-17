import { useQuery } from 'react-query'
import { bondPrice } from '../common/ethereum'
import defaults from '../common/defaults'

export const useBondPrice = (bondAddress, staleTime = defaults.api.staleTime) => {

	const price = useQuery(`${bondAddress}_bondPrice`, async () => {
		if (bondAddress) {
			return await bondPrice(
				bondAddress,
			)
		}
	}, {
		staleTime: staleTime,
	},
	)

	return price
}
