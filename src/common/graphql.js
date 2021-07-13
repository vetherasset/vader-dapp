import { request, gql } from 'graphql-request'
import { BigNumber } from 'ethers/lib'
import defaults from './defaults'

const getData = async (options) => {
	const dataQuery = gql`
		query data (${options.params}) {
			${options.schema} ${options.conditions} {
				${options.entities}
			}
		}
	`

	return request(
		defaults.graphUrl,
		dataQuery,
		options.variables,
	).then(data=> data[options.schema])
}

const getAllTokens = async (options) => {
	return await getData({
		...options,
		schema: 'tokens',
		entities: `
			id
			address
			totalSupply
			synth {
				id
				address
			}
			isSynth
			isAsset
			isAnchor
			liquidityUnits
			baseToken {
				id
				address
			}
			baseAmount
			tokenAmount
		`,
	})
}

const getAllAssetPools = async (skip, first) => {
	return await getAllTokens({
		params: '$skip: Int, $first: Int',
		conditions: '(skip: $skip, first: $first, where: {isAsset: true})',
		variables: {
			skip,
			first,
		},
	})
}

const getAllAnchorPools = async (skip, first) => {
	return await getAllTokens({
		params: '$skip: Int, $first: Int',
		conditions: '(skip: $skip, first: $first, where: {isAnchor: false})',
		variables: {
			skip,
			first,
		},
	})
}

const tokenHasPool = async (address) => {
	const tokens = await getAllTokens({
		params: '$address: String',
		conditions: '(where: {address: $address})',
		variables: {
			address,
		},
	})

	return tokens.length > 0 && BigNumber.from(tokens[0].liquidityUnits).gt(0)
}

export {
	getAllAssetPools,
	getAllAnchorPools,
	tokenHasPool,
}