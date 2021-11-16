import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import defaults from './defaults'

const client = new ApolloClient({
	uri: defaults.api.graphUrl,
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
		const result = await client.query({ query: gql(tokensQuery) })
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

export {
	getXVaderPriceByBlock,
}
