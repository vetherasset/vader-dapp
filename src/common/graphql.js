const { request, gql } = require('graphql-request')
import defaults from './defaults'

const getAllAssetPools = async (skip, first) => {
	const assetsQuery = gql`
		query assets ($skip: Int, $first: Int) {
			assets {
				id
				address
				deposit
				balance
				lastHarvestedTime
			}
		}
	`
	return request(
		defaults.graphUrl,
		assetsQuery,
		{
			skip,
			first,
		},
	).then(data=> data.assets)
}

export {
	getAllAssetPools,
}