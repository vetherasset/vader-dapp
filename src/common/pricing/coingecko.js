import axios from 'axios'

const getPrice = async (coingeckoId) => {
	const url = `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=${coingeckoId}`
	try {
		const res = await axios.get(url)
		return res && res.data && res.data[coingeckoId] && res.data[coingeckoId].usd
	}
	catch (err) {
		console.error('GET_VADER_PRICE', err)
		return null
	}
}
const getVaderPrice = () => {
	const VADER_ID = 'vader-protocol'
	return getPrice(VADER_ID)
}

export default {
	getVaderPrice,
}
