import { BigNumber, ethers } from 'ethers'
import { useWallet } from 'use-wallet'
import { useEffect } from 'react'

const useBalanceHooks = (getBalanceFn)=>{
	const wallet = useWallet()

	useEffect(()=>{
	  if(wallet.account) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getBalanceFn(provider, wallet.account).then(data => {
				return +ethers.utils.formatEther(BigNumber.from(data))
			}).catch(e =>{
				console.log(e)
				return 0
			})
		}
	}, [wallet.account])
}

export default useBalanceHooks