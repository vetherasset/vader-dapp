import uniswap from './uniswap'
import coingecko from './coingecko'
import defaults from '../defaults'

const getVaderPrice = async () => {
	const price = defaults.network.chainId === 1 ?
		await uniswap.getVaderPriceInUSD() :
		await coingecko.getVaderPrice()
	if (!price) {
		return coingecko.getVaderPrice()
	}
	return price
}

export {
	getVaderPrice,
}
