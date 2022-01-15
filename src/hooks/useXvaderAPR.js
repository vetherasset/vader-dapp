import defaults from '../common/defaults'
import { useXvaderPrice } from './useXvaderPrice'
import { utils } from 'ethers'

export const useXvaderAPR = (type = 'Day', basedOnNumberOfRecords, days = 365, pollInterval = defaults.api.graphql.pollInterval) => {

	const [xvaderPrices] = useXvaderPrice(basedOnNumberOfRecords, pollInterval, type)

	if(xvaderPrices) {
		const [currentPrice] = xvaderPrices?.globals
		const [oldestPrice] = xvaderPrices?.globals?.slice(-1)
		if(Number(currentPrice.value) && Number(oldestPrice.value)) {
			const currentPriceBN = utils.parseUnits(currentPrice.value, 'wei')
			const oldestPriceBN = utils.parseUnits(oldestPrice.value, 'wei')
			const daysDifferent = Math.floor((currentPrice.timestamp - oldestPrice.timestamp) / 86400)
			const apr = ((((currentPriceBN.sub(oldestPriceBN))
				.mul(utils.parseUnits('1', 18)))
				.div(oldestPriceBN))
				.div(daysDifferent)
				.mul(days))
				.toString()
			return [utils.formatUnits(apr)]
		}
	}

	return []
}