/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import { getVirtualPrice } from '../common/ethereum'
import defaults from '../common/defaults'

export const useUSDVprice = (rpc = true, pollInterval = defaults.api.graphql.pollInterval, staleTime = defaults.api.staleTime) => {

	if (!rpc) {
		// GQL 2 DO
	}
	else {

		const usdv3crvfPrice = useQuery(`virtualPrice_${defaults.address.usdv3crvf}`,
			async () => {
				return await getVirtualPrice(defaults.address.usdv3crvf)
			}, {
				staleTime: defaults.api.staleTime,
			},
		)

		const crv3poolPrice = useQuery(`virtualPrice_${defaults.address.crv3pool}`,
			async () => {
				return await getVirtualPrice(defaults.address.crv3pool)
			}, {
				staleTime: defaults.api.staleTime,
			},
		)

		if (
			usdv3crvfPrice?.data &&
			crv3poolPrice?.data) {
			return Number(usdv3crvfPrice?.data?.toString()) / Number(crv3poolPrice?.data?.toString())
		}
	}

}