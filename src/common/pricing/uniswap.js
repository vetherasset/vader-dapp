import { getUniswapPairInfo } from '../graphql'
import defaults from '../defaults'

const getVaderPriceInUSD = async () => {
	const vaderEthUniV2Pool = defaults.address.uniswapV2Pools.vaderEthPool
	const usdcEthUniV2Pool = defaults.address.uniswapV2Pools.usdcEthPool
	if (!vaderEthUniV2Pool || !usdcEthUniV2Pool) {
		throw new Error('UniswapV2 pool contract address not found')
	}
	try {
		const vaderEthPairInfo = await getUniswapPairInfo(vaderEthUniV2Pool)
		if (!vaderEthPairInfo) {
			return null
		}
		const vaderPriceInETH = vaderEthPairInfo.token1Price
		const usdcEthPairInfo = await getUniswapPairInfo(usdcEthUniV2Pool)
		if (!usdcEthPairInfo) {
			return null
		}
		const usdcPriceInEth = usdcEthPairInfo.token0Price
		const vaderPriceInUSD = vaderPriceInETH * usdcPriceInEth
		return vaderPriceInUSD
	}
	catch (err) {
		console.error('GET_VADER_PRICE_IN_USD', err)
		return null
	}
}

export default {
	getVaderPriceInUSD,
}
