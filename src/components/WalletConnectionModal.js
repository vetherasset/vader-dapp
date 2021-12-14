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
				title: 'Cannot connect wallet',
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
				toast({
					...walletNotConnected,
					title: 'Cannot connect wallet',
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
				scrollBehavior="inside"
				isCentered
				size="xl"
			>
				<ModalOverlay />
				<ModalContent overflow="hidden">
					<ModalHeader>Choose Wallet</ModalHeader>
					<ModalCloseButton top="1.29rem" />
					<ModalBody>
						<Box p="1.5rem">
							<Grid templateColumns="repeat(3, 1fr)" gap={3}>
								{wallets.map(w => (
									<GridItem key={w.key}>
										<Flex
											flexDir="column"
											alignItems="center"
											p="1rem"
											_hover={{
												background: '#F3F5FA',
												borderRadius: '20px',
												cursor: 'pointer',
											}}
											onClick={() => connect(w.key)}
										>
											<Image src={w.logo} width="50px" />
											<Text mt="0.5rem" fontWeight="bold">
												{w.name}
											</Text>
										</Flex>
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
