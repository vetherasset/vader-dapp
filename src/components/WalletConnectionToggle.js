import React, { useRef, useState, useEffect } from 'react'
import defaults from '../common/defaults'
import { useWallet } from 'use-wallet'
import { Button, useToast } from '@chakra-ui/react'
import { prettifyAddress } from '../common/utils'
import Jazzicon from '@metamask/jazzicon'
import { connected } from '../messages'
import { ethers } from 'ethers'

export const WalletConnectionToggle = (props) => {

	const initialText = 'Connect'
	const wallet = useWallet()
	const ref = useRef()
	const toast = useToast()
	const [working, setWorking] = useState(false)
	const [text, setText] = useState(initialText)

	const setDefaults = ()=>{
		defaults.network.provider = wallet.ethereum ? new ethers.providers.Web3Provider(wallet.ethereum) : null
		defaults.user.account = wallet.account ? wallet.account : ''
	}

	const toggle = () => {
		if (!wallet.account) {
			setWorking(true)
			wallet.connect(defaults.network.connector)
				.then(() => setWorking(false))
				.catch(console.log)
		}
	}

	useEffect(() => {
		if (wallet.account !== null) {
			setText(prettifyAddress(wallet.account))
			ref.current.appendChild(Jazzicon(16, parseInt(
				wallet.account.slice(2, 10), 16)))
				.style.marginLeft = '7px'
			toast(connected)
			setDefaults()
		}
		return () => {
			if (wallet.account) {
				if (ref.current) ref.current.getElementsByTagName('div')[0].remove()
				setText(initialText)
			}
		}
	}, [wallet.account])

	return (
		<Button
			size='md'
			minWidth='initial'
			fontSize={{ base: '0.65rem', sm: 'sm' }}
			variant='solid'
			aria-label='Wallet Connection Status'
			isLoading={working}
			onClick={toggle}
			display='flex'
			flexDirection='row'
			ref={ref}
			{...props}
			style={{
				textAlign: 'center',
			}}
		>
			<span style={{
				order: '-1',
			}}>
				{text}
			</span>
		</Button>
	)
}
