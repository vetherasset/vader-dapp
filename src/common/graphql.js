import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { utils } from 'ethers'
import defaults from './defaults'

const getXVaderPrice = async (type = 'Hour', first = 0) => {
	const query = first > 0 ? `
	{
		globals(
			first: ${first}
			skip: 0,
			orderBy: timestamp,
			orderDirection: desc,
			where:{ 
				name: "XVADER_PRICE",
				type: "${type}"
			}) {
			id
			name
			value
			type
			timestamp
		}
	}
	` :	`
	{
		global(id: "XVADER_PRICE") {
			id
			name
			value
		}
	}
	`
	try {
		const result = await queryGraphQL(query, defaults.api.graphql.uri.vaderProtocol)
		if (result) {
			return result
		}
	}
	catch (err) {
		console.log(err)
	}
}

const getXVaderApr = async (type) => {
	const prices = await getXVaderPrice(type, 2)
	const [currentPrice, previousPrice] = prices?.globals
	if(currentPrice && previousPrice) {
		const currentPriceBN = utils.parseUnits(currentPrice.value, 'wei')
		const previousPriceBN = utils.parseUnits(previousPrice.value, 'wei')
		const hoursDifferent = Math.floor((currentPrice.timestamp - previousPrice.timestamp) / 3600)
		const apr = ((((currentPriceBN.sub(previousPriceBN))
			.mul(utils.parseUnits('1', 18)))
			.div(previousPriceBN))
			.mul(365))
			.mul(7)
			.div(hoursDifferent)
			.toString()
		return utils.formatUnits(apr)
	}
}

const queryGraphQL = async (query, uri) => {
	try {
		const client = new ApolloClient({
			uri: uri,
			cache: new InMemoryCache(),
		})
		const result = await client.query({ query: gql(query) })
		if (result && result.data) {
			return result.data
		}
	}
	catch (err) {
		console.log(`Failed to get data from GraphQL: ${err}`)
	}
}

export {
	getXVaderPrice, getXVaderApr,
}
