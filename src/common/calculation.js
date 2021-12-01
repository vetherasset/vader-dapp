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
	const daysAgoTs = startOfDayTs - SECOND_IN_A_DAY * numberOfDays
	const timestampInMs = daysAgoTs * 1000
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

const getXVaderAprByNumberOfDays = async (numberOfDays = 7) => {
	const daysAgoBlockNumber = await getBlockNumberPriorDaysAgo(numberOfDays)
	if (!daysAgoBlockNumber) {
		return null
	}
	const [currentPrice, daysAgoPrice] = await Promise.all([
		getXVaderPrice(),
		getXVaderPrice(daysAgoBlockNumber),
	])
	const currentPriceBN = ethers.utils.parseUnits(currentPrice)
	const daysAgoPriceBN = ethers.utils.parseUnits(daysAgoPrice)
	const apr = currentPriceBN
		.sub(daysAgoPriceBN)
		.mul(ethers.utils.parseUnits('1'))
		.div(daysAgoPriceBN)
		.mul(365)
		.div(numberOfDays)
		.toString()
	return ethers.utils.formatUnits(apr)
}

const getXVaderApr = async (maxNumberOfDays = 7) => {
	if (maxNumberOfDays === 0) {
		return null
	}
	console.log('GETTING_APR', maxNumberOfDays)
	const apr = await getXVaderAprByNumberOfDays(maxNumberOfDays)
	if (+apr > 0) {
		console.log('FOUND', apr, maxNumberOfDays)
		return apr
	}
	return getXVaderApr(maxNumberOfDays - 1)
}

export {
	getXVaderPrice,
	getXVaderApr,
}
