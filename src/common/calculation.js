import BN from 'bignumber.js'
import EthDater from 'ethereum-block-by-date'
import { getXVaderPriceByBlock } from './graphql'
import { getStartOfTheDayTimeStamp, getCompoundApy } from './utils'
import defaults from './defaults'

const getXVaderPrice = () => getXVaderPriceByBlock()

const getBlockNumberPriorDaysAgo = async (numberOfDays) => {
	const dater = new EthDater(defaults.network.provider)
	const SECOND_IN_A_DAY = 86400
	const startOfDayTs = getStartOfTheDayTimeStamp()
	const sevenDaysAgoTs = startOfDayTs - SECOND_IN_A_DAY * numberOfDays
	const timestampInMs = sevenDaysAgoTs * 1000
	const cachedHits = localStorage.getItem('BLOCK_NUMBER_BY_TIMESTAMP')
	if (cachedHits) {
		const data = JSON.parse(cachedHits)
		if (data.timestamp === timestampInMs) {
			return data.block
		}
	}
	try {
		const response = await dater.getDate(timestampInMs, true)
		localStorage.setItem('BLOCK_NUMBER_BY_TIMESTAMP', JSON.stringify(response))
		return response && response.block
	}
	catch (err) {
		console.log('getBlockNumberPriorDaysAgo', err)
		return null
	}
}

const getXVaderApy = async (numberOfDays = 7) => {
	const sevenDaysAgoBlockNumber = await getBlockNumberPriorDaysAgo(numberOfDays)
	if (!sevenDaysAgoBlockNumber) {
		return null
	}
	const [currentPrice, sevenDaysAgoPrice] = await Promise.all([
		getXVaderPrice(),
		getXVaderPrice(sevenDaysAgoBlockNumber),
	])
	const roi = BN(currentPrice).minus(sevenDaysAgoPrice)
	return getCompoundApy(roi, numberOfDays)
}

export {
	getXVaderPrice,
	getXVaderApy,
}
