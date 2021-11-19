import BN from 'bignumber.js'
import EthDater from 'ethereum-block-by-date'
import { getXVaderPriceByBlock } from './graphql'
import { getStartOfTheDayTimeStamp, getCompoundApy } from './utils'
import defaults from './defaults'
import { getLPVirtualPrice, getERC20BalanceOf, lpTokenStaking } from './ethereum'
import { ethers } from 'ethers'
import axios from 'axios'

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

const getVaderPrice = async () => {
	const VADER_ID = 'vader'
	const url = `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=${VADER_ID}`
	try {
		const res = await axios.get(url)
		return res && res.data && res.data[VADER_ID] && res.data[VADER_ID].usd
	}
	catch (err) {
		console.error('GET_VADER_PRICE', err)
		return null
	}
}

const calculateLPTokenAPR = async ({
	type, stakingContractAddress,
}) => {
	const getCurvePoolTokenPrice = async () => {
		try {
			const price = await getLPVirtualPrice()
			return ethers.BigNumber.from(price)
		}
		catch (err) {
			console.error('GET_CURVE_POOL_TOKEN_PRICE', err)
			return null
		}
	}
	const vaderPrice = await getVaderPrice()
	if (!vaderPrice) {
		return null
	}
	let lpTokenPrice = null
	switch (type) {
	case 'CURVE_POOL':
		lpTokenPrice = await getCurvePoolTokenPrice()
		break
	default:
		break
	}
	if (!lpTokenPrice) {
		return null
	}
	const vaderPriceBN = ethers.utils.parseUnits(vaderPrice)
	const lpTokenPriceBN = ethers.utils.parseUnits(lpTokenPrice)
	const lpTokenStakingContract = lpTokenStaking(stakingContractAddress)
	const [rewardPerLPToken, rewardsDuration] = await Promise.all([
		lpTokenStakingContract.rewardPerToken(),
		lpTokenStakingContract.rewardsDuration(),
	])
	const rewardPrice = ethers.BigNumber.from(rewardPerLPToken).mul(vaderPriceBN)

	const apr = rewardPrice
		.div(lpTokenPriceBN)
		.mul(365 * 86400)
		.div(rewardsDuration)
		.toString()

	return ethers.utils.formatUnits(apr)
}

export {
	getXVaderPrice,
	getXVaderApy,
	calculateLPTokenAPR,
}
