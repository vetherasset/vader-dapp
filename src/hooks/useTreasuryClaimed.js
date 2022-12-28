/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import { getTreasuryClaimed } from '../common/ethereum'
import defaults from '../common/defaults'
import { useWallet } from 'use-wallet'
import { BigNumber } from 'ethers'

export const useTreasuryClaimed = (
	account = '',
	amount = BigNumber.from(0),
	staleTime = defaults.api.staleTime) => {

	const wallet = useWallet()

	const claimed = useQuery(`treasuryClaimed_${account ? account : wallet?.account}`, async () => {
		return await getTreasuryClaimed(account ? account : wallet.account)
	}, {
		staleTime: staleTime,
		enabled: (!!account || !!wallet.account),
	},
	)

	return claimed
}
