import { useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { detectMetaMask } from './useDetectProvider'

export const useDetectMetaMaskAnytime = () => {
	const [isMetaMaskInstalled, setInstall] = useState()

	useEffect(() => {
		async function checkForMetaMask() {
			const metamask = await detectMetaMask()
			setInstall(metamask ? true : false)
		}

		checkForMetaMask()
	}, [])

	return isMetaMaskInstalled
}

export const useDetectMetaMask = () => {
	const wallet = useWallet()
	const [isMetaMask, setMetamask] = useState()

	const { providerInfo } = wallet

	useEffect(() => {
		setMetamask(providerInfo?.id === 'metamask')
	}, [providerInfo])

	return isMetaMask
}

export default useDetectMetaMask
