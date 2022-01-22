/* eslint-disable no-inline-comments */
import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
	Box, Flex, Badge, Text, Button, Image, Divider,
	useMediaQuery, useToast, useClipboard,
} from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'

import Container from '../components/Container'
import Row from '../components/Row'

import defaults from '../common/defaults'
import { copiedContractAddress } from '../messages'

import useDetectMetaMask from '../hooks/useDetectMetamask'
import { useWallet } from 'use-wallet'

const CUSTOM_TOKENS = [ defaults.vader, defaults.xvader, defaults.usdv ]
const WALLET_STATUS = {
	DISCONNECTED: 'disconnected',	// no wallet connected (default state)
	CONNECTING: 'connecting',		// trying to connect to the wallet
	CONNECTED: 'connected',			// connected to the wallet (i.e. the account is available)
	ERROR: 'error',					// a connection error occured
}

const addTokenToMetaMask = async (
	{ address, decimals, logoURI, symbol },
	wallet,
) => {
	if (address && wallet && wallet.ethereum) {
		try {
			// #bug atm: doesn't wait for actual confirmation.. :(
			/* eslint-disable no-unused-vars */
			const wasAdded = await wallet.ethereum.request({
				method: 'wallet_watchAsset',
				params: {
					type: 'ERC20',
					options: {
						address,
						symbol,
						decimals,
						image: logoURI,
					},
				},
			})

			// if (wasAdded) { do magic } // #sadface
		}
		catch (ex) {
			console.log(ex)
		}
	}
	else {
		console.warn('No Web3 provider/wallet detected...?')
	}
}

const Token = ({ token, wallet, isMetaMask, ...rest }) => {
	const [isLargerThan400] = useMediaQuery('(min-width: 380px)')
	const [isLoading, setLoading] = useState(false)

	const { name, logoURI, symbol } = token
	const { isConnected: getConnected, status } = wallet

	// wait for wallet to connect...
	const isConnected = getConnected()
	const isConnecting = status === WALLET_STATUS.CONNECTING

	const addToWallet = useCallback(() => {
		setLoading(true)

		if (isMetaMask && wallet) { addTokenToMetaMask(token, wallet) }

		// auto-timeout, re-enable button...
		setTimeout(() => setLoading(false), 3000)
	}, [isMetaMask, wallet])

	return (
		<Row direction={isLargerThan400 ? 'row' : 'column'} {...rest}>
			<Flex marginBottom={!isLargerThan400 ? '10px' : null}>
				<Image
					src={logoURI}
					alt={`${name} token`}
					width='24px'
					height='24px'
					marginRight='6px'
				/>
				<Box as='h3' margin='0' fontSize='1.02rem' fontWeight='bold'>
					{symbol}
				</Box>
			</Flex>

			<Button
				variant='solidRounded'
				size='xs'
				textTransform='uppercase'
				padding="0 10px"

				isLoading={isConnecting || isLoading}
				loadingText={isLoading ? 'Requesting...' : 'Connecting...'}

				disabled={!isMetaMask || !isConnected || isLoading}

				onClick={addToWallet}
			>
				{isConnected
					? isMetaMask ? 'Add to wallet' : 'Only in MetaMask'
					: 'Connect wallet'
				}
			</Button>

			{/* #TODO: can't detect confirmation on added token (always true) #bug :< */}
			{/* <Badge colorScheme='green' variant='solid'>Added</Badge> */}
		</Row>
	)
}

Token.propTypes = {
	token: PropTypes.shape({
		name: PropTypes.string.isRequired,
		logoURI: PropTypes.string.isRequired,
		symbol: PropTypes.string.isRequired,
		address: PropTypes.string,
		decimals: PropTypes.number,
	}),
	wallet: PropTypes.object.isRequired,
	isMetaMask: PropTypes.bool,
}

const Tokens = ({ inverted = false, ...props }) => {
	const wallet = useWallet()
	const isMetaMask = useDetectMetaMask()

	const [isSmallDevice] = useMediaQuery('(min-width: 500px)')
	const toast = useToast()

	const [activeToken, setToken] = useState(CUSTOM_TOKENS[0])
	const { hasCopied, onCopy } = useClipboard(activeToken.address)

	const onTokenHover = token => { setToken(token) }

	useEffect(async () => {
		// trigger copy-pasta toast notification
		if (hasCopied) { toast(copiedContractAddress) }
	}, [hasCopied])

	return (
		<Box
			maxWidth={defaults.layout.container.sm.width}
			m='0 auto'
			p={{ base: '3rem 1.1rem 0', md: '5rem 0 0' }}
			{...props}
		>
			<Container inverted={inverted} padding='2rem 0.9rem'>

				<Text
					align='center'
					fontSize={{ base: '1.25rem', md: '1.55rem' }}
					fontWeight='bolder'
				>
					Tokens
				</Text>
				<Text
					align='center'
					fontSize={{ base: '0.91rem', md: '1.12rem' }}
				>
					Add tokens to your Web3 wallet
				</Text>

				{/* TOKENS list / add buttons */}
				<Box
					margin="2rem 1rem 0"
				>
					{CUSTOM_TOKENS.map(token => (
						<Token
							key={token.symbol}
							token={token}
							wallet={wallet}
							isMetaMask={isMetaMask}
							onMouseEnter={() => onTokenHover(token)}
						/>
					))}
				</Box>

				{/* #@SEPARATOR #DIY */}
				<Flex
					position='relative'
					alignItems='center'
					flexDirection='column'
					margin='20px 40px'
				>
					<Text
						as='h3'
						zIndex='1'
						fontSize='1.1rem'
						fontWeight='bolder'
						fontStyle='italic'
						padding='2px 10px'
						margin='0'
						backdropFilter='blur(10px)'
					>
						Or #DoItYourself
					</Text>
					<Divider
						position='absolute'
						top='50%'
						left='50%'
						transform='translate(-50%, -50%)'
					/>
				</Flex>

				{/* #DIY instructions */}
				<Row>
					<Flex
						width='100%'
						margin='20px 0'
						direction={isSmallDevice ? 'row' : 'column'}
						alignItems={!isSmallDevice ? 'center' : null}
					>
						{/* LOGO */}
						<Box
							flexShrink='0'
							marginRight={isSmallDevice ? '8px' : null}
							marginBottom={!isSmallDevice ? '16px' : null}
						>
							<Image
								src={activeToken.logoURI}
								alt={`${activeToken.name} token`}
								width='60px'
								height='60px'
							/>
						</Box>

						{/* BADGES */}
						<Flex
							width='100%'
							flexWrap='wrap'
							alignContent='center'
							gridGap='4px'
						>
							<Badge
								width="100%"
								onClick={onCopy}
								background='rgba(0, 0, 0, 0.16)'
								border='1px solid transparent'
								_hover={{
									cursor: 'pointer',
									background: 'rgba(244, 155, 202, 0.2) none repeat scroll 0% 0%',
									border: '1px solid #ffffff10',
								}}
							>
								<span style={{ userSelect: 'none' }}>
									<CopyIcon color='#fff' _hover={{ color: '#f79ddc' }}/>
									&nbsp;
									Address:
								</span>
								<Box ></Box>
								<div
									style={{
										textOverflow: 'clip',
										overflow: 'hidden',
									}}>
									{activeToken.address}
								</div>
							</Badge>
							<Flex
								width='100%'
								flexWrap='wrap'
								gridGap={!isSmallDevice ? '4px' : null}
								justifyContent='space-around'
							>
								<Badge background='rgba(0, 0, 0, 0.16)'>
									Name: {activeToken.name}
								</Badge>
								<Badge background='rgba(0, 0, 0, 0.16)'>
									Symbol: {activeToken.symbol}
								</Badge>
								<Badge background='rgba(0, 0, 0, 0.16)'>
									Decimals: {activeToken.decimals}
								</Badge>
							</Flex>
						</Flex>
					</Flex>
				</Row>
			</Container>
		</Box>
	)
}

Tokens.propTypes = {
	inverted: PropTypes.bool,
}

export default Tokens
