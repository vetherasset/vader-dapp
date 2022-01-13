import { useEffect, useState } from 'react'
import { detectMetaMask } from './useDetectProvider'

const useDetectMetaMask = () => {
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

export default useDetectMetaMask
