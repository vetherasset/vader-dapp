import EthDater from 'ethereum-block-by-date'
import { getXVaderPriceByBlock } from './graphql'
import { getStartOfTheDayTimeStamp } from './utils'
import defaults from './defaults'
import { ethers } from 'ethers'

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
		console.log(err)
		return null
	}
}

const getXVaderApy = async (numberOfDays = 1) => {
	const daysAgoBlockNumber = await getBlockNumberPriorDaysAgo(numberOfDays)
	if (!daysAgoBlockNumber) {
		return null
	}
	const [currentPrice, daysAgoPrice] = await Promise.all([
		getXVaderPrice(),
		getXVaderPrice(daysAgoBlockNumber),
	])
	const currentPriceBN = ethers.utils.parseUnits(currentPrice)
	const sevenDaysAgoPriceBN = ethers.utils.parseUnits(daysAgoPrice)
	const apr = currentPriceBN
		.sub(sevenDaysAgoPriceBN)
		.mul(ethers.utils.parseUnits('1'))
		.div(sevenDaysAgoPriceBN)
		.mul(365)
		.div(numberOfDays)
		.toString()
	return ethers.utils.formatUnits(apr)
}

export {
	getXVaderPrice,
	getXVaderApy,
}
