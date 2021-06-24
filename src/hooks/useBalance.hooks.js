import { BigNumber, ethers } from 'ethers'
import { useWallet } from 'use-wallet'
import { useEffect, useState } from 'react'

const useBalanceHooks = (getBalanceFn) => {
	const wallet = useWallet()
	const [balance, setBalance] = useState(0)

	useEffect(() => {
		// reset balance to 0
		setBalance(0)
		if (wallet.account) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getBalanceFn({ provider, account: wallet.account }).then(data => {
				setBalance(BigNumber.from(data))
			}).catch(e => {
				console.log(e)
				setBalance(0)
			})
		}
	}, [wallet.account, getBalanceFn])
	return balance
}

export default useBalanceHooks