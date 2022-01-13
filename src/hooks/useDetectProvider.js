import { useEffect, useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'

export const detectWeb3Provider = async (timeout = 1000, options = {}) => {
	const provider = await detectEthereumProvider({ timeout, ...options })
	return provider ? provider : false
}

export const detectMetaMask = async (timeout = 1000) => {
	const metamask = await detectWeb3Provider(timeout, { mustBeMetaMask: true })
	return metamask ? true : false
}

export const useDetectProvider = () => {
	const [providerWeb3, setProvider] = useState(null)

	useEffect(() => {
		async function getProvider() {
			const provider = await detectWeb3Provider()
			setProvider(provider ? provider : false)
		}

		getProvider()
	}, [])

	return providerWeb3
}

export default useDetectProvider
