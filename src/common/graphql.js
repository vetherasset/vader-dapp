import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import defaults from './defaults'

const client = new ApolloClient({
	uri: defaults.api.graphUrl2,
	cache: new InMemoryCache(),
})

const getXVaderPriceByBlock = async (block) => {
	const tokensQuery = block ? `
		query {
			xvaderPrices(block: { number: ${block} }) {
				id
				xvaderTotalSupply
				vaderTotalLocked
				price
			}
		}
	` : `
		query {
			xvaderPrices {
				id
				xvaderTotalSupply
				vaderTotalLocked
				price
			}
		}
	`
	try {
		const result = await client.query({ query: gql(tokensQuery) })
		const xvaderPrices = result.data && result.data.xvaderPrices
		if (xvaderPrices.length === 0) {
			return null
		}
		return xvaderPrices[0].price
	}
	catch (err) {
		return null
	}
}

export {
	getXVaderPriceByBlock,
}
