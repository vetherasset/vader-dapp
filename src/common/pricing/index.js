import uniswap from './uniswap'
import coingecko from './coingecko'

const getVaderPrice = async () => {
	const price = await uniswap.getVaderPriceInUSD()
	if (!price) {
		return coingecko.getVaderPrice()
	}
	return price
}

export {
	getVaderPrice,
}
