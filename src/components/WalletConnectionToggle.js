import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'
import { useWallet } from 'use-wallet'
import { Menu, MenuButton, Button, Portal, MenuList,
	MenuItem, Flex, Image, useToast, MenuDivider } from '@chakra-ui/react'
import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import { prettifyAddress } from '../common/utils'
import Jazzicon from '@metamask/jazzicon'
import { connected } from '../messages'
import { WalletConnectionModal } from './WalletConnectionModal'
import defaults from '../common/defaults'

export const WalletConnectionToggle = props => {
	const initialText = 'Connect'
	const history = useHistory()
	const location = useLocation()
	const wallet = useWallet()
	const ref = useRef()
	const toast = useToast()
	const [working, setWorking] = useState(false)
	const [text, setText] = useState(initialText)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const toggle = () => {
		if (!wallet.account) {
			setIsModalOpen(true)
		}
		else {
			setIsMenuOpen(true)
		}
	}

	useEffect(() => {
		if (wallet.account !== null) {
			setText(prettifyAddress(wallet.account))
			ref.current.appendChild(
				Jazzicon(16, parseInt(wallet.account.slice(2, 10), 16)),
			).style.marginLeft = '7px'
			toast(connected)
		}
		return () => {
			if (wallet.account) {
				if (ref.current) ref.current.getElementsByTagName('div')[0].remove()
				setText(initialText)
			}
		}
	}, [wallet.account])

	return (
		<>
			<Menu
				isOpen={isMenuOpen}
				onClose={() => setIsMenuOpen(false)}
				closeOnEsc={true}
				closeOnBlur={true}
				matchWidth={true}
				placement={'bottom-end'}
				autoSelect={false}
			>
				<MenuButton
					as={Button}
					size='md'
					minWidth='initial'
					fontSize={{ base: '0.65rem', sm: 'sm' }}
					variant='solidRounded'
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
					<span
						style={{
							order: '-1',
						}}
					>
						{text}
					</span>
				</MenuButton>
				<Portal>
					<MenuList zIndex={{ base: '2', md: '1' }}>
						{/* TRACK TOKENS */}
						{!location.pathname.includes('tokens') && (
							<>
								<MenuItem
									icon={<AddIcon layerStyle='menuIcon' />}
									onClick={() => history.push('/tokens')}
								>
									<Flex gridGap={'7px'}>
										Track
										<Flex justifyContent='flex-start' fontWeight='bolder'>
											<Image
												width='24px'
												height='24px'
												mr='5px'
												src={defaults.vader.logoURI}
												alt={`${defaults.vader.name} token`}
											/>
											<Image
												width='24px'
												height='24px'
												mr='5px'
												src={defaults.xvader.logoURI}
												alt={`${defaults.xvader.name} token`}
											/>
											<Image
												width='24px'
												height='24px'
												mr='5px'
												src={defaults.usdv.logoURI}
												alt={`${defaults.usdv.name} token`}
											/>
										</Flex>
										in wallet
									</Flex>
								</MenuItem>
								<MenuDivider />
							</>
						)}

						{/* DISCONNECT */}
						<MenuItem
							icon={<CloseIcon layerStyle='menuIcon' />}
							onClick={() => wallet?.reset()}
						>
      						Disconnect
						</MenuItem>
					</MenuList>
				</Portal>
			</Menu>
			<WalletConnectionModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false) & setWorking(false)}
				setWorking={setWorking}
			/>
		</>
	)
}
