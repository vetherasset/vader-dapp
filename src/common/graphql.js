import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import defaults from './defaults'

const vaderClient = new ApolloClient({
	uri: defaults.api.graphUrl,
	cache: new InMemoryCache(),
})

const uniswapClient = new ApolloClient({
	uri: defaults.api.uniswapV2GraphUrl,
	cache: new InMemoryCache(),
})

const getXVaderPriceByBlock = async (block) => {
	const tokensQuery = block ? `
		query {
			globals(block: { number: ${block} }) {
				id
				name
				value
			}
		}
	` : `
		query {
			globals {
				id
				name
				value
			}
		}
	`
	try {
		const result = await vaderClient.query({ query: gql(tokensQuery) })
		if (!result || !result.data || !result.data.globals) {
			return null
		}
		const xvaderPrice = result.data.globals.find(r => r.id === 'XVADER_PRICE')
		return xvaderPrice && xvaderPrice.value
	}
	catch (err) {
		console.error('getXVaderPriceByBlock', err)
		return null
	}
}

const getUniswapPairInfo = async (poolContractAddress) => {
	const tokensQuery = `
		query {
			pair(id: "${poolContractAddress}") {
				token0Price,
				token1Price,
			}
		}
	`
	try {
		const result = await uniswapClient.query({ query: gql(tokensQuery) })
		return result && result.data && result.data.pair
	}
	catch (err) {
		console.error('getUniswapPairInfo', err)
		return null
	}
}

export {
	getXVaderPriceByBlock,
	getUniswapPairInfo,
}
