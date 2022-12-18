/* eslint-disable no-unused-vars */
import { useQuery as useApolloQuery, gql } from '@apollo/client'
import { useQuery } from 'react-query'
import { getTreasuryClaimed } from '../common/ethereum'
import defaults from '../common/defaults'
import { useWallet } from 'use-wallet'
import { BigNumber } from 'ethers'
import usdv from '../artifacts/json/treasuryMap/usdv'
import vader from '../artifacts/json/treasuryMap/vader'

export const useTreasuryHasClaim = (
	account = '',
	staleTime = defaults.api.staleTime) => {

	const wallet = useWallet()
	const hasUsdv = Object.prototype.hasOwnProperty.call(usdv, account ? account : wallet.account)
	const hasVader = Object.prototype.hasOwnProperty.call(vader, account ? account : wallet.account)

	if (hasUsdv || hasVader) return 1
	if (hasUsdv && hasVader) return 2
	return 0
}
