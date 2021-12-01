import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import defaults from './defaults'

const getXVaderPrice = async (type = 'Hour', skip = 0, first = 1, uri = defaults.api.graphql.uri.vaderProtocol) => {
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
		const result = await queryGraphQL(query, uri)
		if (result) {
			return result
		}
	}
	catch (err) {
		console.log(err)
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
	getXVaderPrice,
}
