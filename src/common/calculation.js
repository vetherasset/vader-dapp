import axios from 'axios'
import BN from 'bignumber.js'
import { getXVaderPriceByBlock } from './graphql'
import { getStartOfTheDayTimeStamp, getCompoundApy } from './utils'
import defaults from './defaults'

const getXVaderPrice = () => getXVaderPriceByBlock()

const getBlockNumberPriorDaysAgo = async (numberOfDays) => {
	const SECOND_IN_A_DAY = 86400
	const startOfDayTs = getStartOfTheDayTimeStamp()
	const sevenDaysAgoTs = startOfDayTs - SECOND_IN_A_DAY * numberOfDays
	const url = `${defaults.api.etherscanApiUrl}/api
		?module=block
		&action=getblocknobytime
		&timestamp=${sevenDaysAgoTs}
		&closest=before
		&apikey=${defaults.api.etherscanApiKey}
	`
	try {
		const response = await axios.get(url)
		return response && response.data && response.data.result
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
