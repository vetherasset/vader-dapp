import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import defaults from '../common/defaults'
import { useWallet } from 'use-wallet'
import {
	Modal,
	ModalHeader,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	Image,
	Text,
	useToast,
} from '@chakra-ui/react'
import { walletNotConnected } from '../messages'

export const WalletConnectionModal = props => {
	WalletConnectionModal.propTypes = {
		isOpen: PropTypes.bool.isRequired,
		onClose: PropTypes.func.isRequired,
		setWorking: PropTypes.func.isRequired,
	}
	const wallet = useWallet()
	const toast = useToast()
	const wallets = Object.values(defaults.network.connectors).map(
		item => item.meta,
	)

	useEffect(() => {
		if (wallet.error) {
			return toast({
				...walletNotConnected,
				description: wallet.error.message,
			})
		}
	}, [wallet.error])

	const connect = key => {
		props.onClose()
		props.setWorking(true)
		wallet
			.connect(key)
			.catch(err => {
				console.log(err)
				toast({
					...walletNotConnected,
					description: err.message,
				})
			})
			.finally(() => {
				props.setWorking(false)
			})
	}

	return (
		<>
			<Modal
				onClose={props.onClose}
				isOpen={props.isOpen}
				autoFocus={false}
				scrollBehavior='inside'
				isCentered
				size='xl'
			>
				<ModalOverlay />
				<ModalContent overflow='hidden'>
					<ModalHeader>Connect Wallet</ModalHeader>
					<ModalCloseButton top='1.29rem' />
					<ModalBody minH='138px'>
						<Box
							p='3px 1.5rem 1.5rem'>
							<Grid templateColumns='repeat(3, 1fr)' gap={3}>
								{wallets.map(w => (
									<GridItem
										key={w.name}>
										<Button
											variant='modalCentricLarge'
											display='flex'
											width='100%'
											flexDir='column'
											alignItems='center'
											onClick={() => connect(w.key)}
										>
											<Flex minH='50px'>
												<Image src={w.logo} width='50px'/>
											</Flex>
											<Text mt='0.5rem'>
												{w.name}
											</Text>
										</Button>
									</GridItem>
								))}
							</Grid>
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	)
}
