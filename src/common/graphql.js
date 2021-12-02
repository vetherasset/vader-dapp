import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { utils } from 'ethers'
import defaults from './defaults'

const getXVaderPrice = async (type = 'Hour', skip = 0, first = 1) => {
	const query = skip > 0 ? `
	{
		globals(
			first: ${first}
			skip: ${skip},
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
	const [currentPrice, daysAgoPrice] = await Promise.all([
		getXVaderPrice(),
		getXVaderPrice(type, 3),
	])
	const currentPriceBN = utils.parseUnits(currentPrice.global.value, 'wei')
	const previousPrice = utils.parseUnits(daysAgoPrice.globals?.[0].value, 'wei')
	const apr = ((((currentPriceBN.sub(previousPrice))
		.mul(utils.parseUnits('1', 18)))
		.div(previousPrice))
		.mul(365))
		.div(7)
		.div(24)
		.toString()
	return utils.formatUnits(apr)
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
