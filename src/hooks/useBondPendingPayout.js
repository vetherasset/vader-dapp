import { useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { ethers } from 'ethers'
import { bondPendingPayoutFor } from '../common/ethereum'
import defaults from '../common/defaults'

export const useBondPendingPayout = (bondContractAddress) => {

	const wallet = useWallet()
	const [block, setBlock] = useState(0)
	const [claimable, setClaimable] = useState(ethers.BigNumber.from('0'))

	useEffect(() => {
		if (wallet.account) {
			bondPendingPayoutFor(bondContractAddress, wallet.account)
				.then((n) => {
					setClaimable(n)
				})
				.catch(err => console.log(err))
		}
	}, [wallet.account, bondContractAddress, block])

	useEffect(() => {
		const interval = setInterval(() => {
			defaults.network.provider.getBlockNumber()
				.then(n => {
					setBlock(n)
				})
		}, defaults.network.pollInterval)
		defaults.network.provider.getBlockNumber()
			.then(n => setBlock(n))
		return () => clearInterval(interval)
	}, [])

	return claimable

}