import { BigNumber, ethers } from 'ethers'
import { useWallet } from 'use-wallet'
import { useEffect, useState } from 'react'
import { getTokenBalance } from '../common/ethereum'

const useBalanceHooks = (tokenName) => {
	const wallet = useWallet()
	const [balance, setBalance] = useState(0)

	useEffect(() => {
		// reset balance to 0
		setBalance(0)
		if (wallet.account) {
			getTokenBalance(tokenName).then(data => {
				setBalance(BigNumber.from(data))
			}).catch(e => {
				console.log(e)
				setBalance(0)
			})
		}
	}, [wallet.account, tokenName])
	return balance
}

export default useBalanceHooks