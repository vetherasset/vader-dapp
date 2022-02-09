/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import { getPreCommitBond, getPreCommitCount, getPreCommitMaxAmountIn, getPreCommitMaxCommits, getPreCommitMinAmountIn, getPreCommitStarted, getPreCommitTokenIn, getPreCommitTotal } from '../common/ethereum'
import defaults from '../common/defaults'
import { useWallet } from 'use-wallet'

export const usePreCommit = (preCommitAddress, rpc = true, pollInterval = defaults.api.graphql.pollInterval, staleTime = defaults.api.staleTime) => {

	if (!rpc) {
		// GQL 2 DO
	}
	else {

		const bond = useQuery(`${preCommitAddress}_bond`,
			async () => {
				if (preCommitAddress) {
					return await getPreCommitBond(
						preCommitAddress,
					)
				}
			}, {
				staleTime: defaults.api.staleTime,
				enabled: !!preCommitAddress,
			},
		)

		const count = useQuery(`${preCommitAddress}_count`,
			async () => {
				if (preCommitAddress) {
					return await getPreCommitCount(
						preCommitAddress,
					)
				}
			}, {
				staleTime: defaults.api.staleTime,
				enabled: !!preCommitAddress,
			},
		)

		const maxAmountIn = useQuery(`${preCommitAddress}_maxAmountIn`,
			async () => {
				if (preCommitAddress) {
					return await getPreCommitMaxAmountIn(
						preCommitAddress,
					)
				}
			}, {
				staleTime: defaults.api.staleTime,
				enabled: !!preCommitAddress,
			},
		)

		const maxCommits = useQuery(`${preCommitAddress}_maxCommits`,
			async () => {
				if (preCommitAddress) {
					return await getPreCommitMaxCommits(
						preCommitAddress,
					)
				}
			}, {
				staleTime: defaults.api.staleTime,
				enabled: !!preCommitAddress,
			},
		)

		const minAmountIn = useQuery(`${preCommitAddress}_minAmountIn`,
			async () => {
				if (preCommitAddress) {
					return await getPreCommitMinAmountIn(
						preCommitAddress,
					)
				}
			}, {
				staleTime: defaults.api.staleTime,
				enabled: !!preCommitAddress,
			},
		)

		const started = useQuery(`${preCommitAddress}_started`,
			async () => {
				if (preCommitAddress) {
					return await getPreCommitStarted(
						preCommitAddress,
					)
				}
			}, {
				staleTime: defaults.api.staleTime,
				enabled: !!preCommitAddress,
			},
		)

		const tokenIn = useQuery(`${preCommitAddress}_tokenIn`,
			async () => {
				if (preCommitAddress) {
					return await getPreCommitTokenIn(
						preCommitAddress,
					)
				}
			}, {
				staleTime: defaults.api.staleTime,
				enabled: !!preCommitAddress,
			},
		)

		const total = useQuery(`${preCommitAddress}_tokenIn`,
			async () => {
				if (preCommitAddress) {
					return await getPreCommitTotal(
						preCommitAddress,
					)
				}
			}, {
				staleTime: defaults.api.staleTime,
				enabled: !!preCommitAddress,
			},
		)

		return {
			bond: bond,
			count: count,
			maxAmountIn: maxAmountIn,
			maxCommits: maxCommits,
			started: started,
			tokenIn: tokenIn,
			total: total,
		}
	}

}