import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import {
	Box, Flex, Badge, Text, Button, Image, Divider,
	useMediaQuery, useToast, useClipboard,
} from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'

import defaults from '../common/defaults'
import { copiedContractAddress } from '../messages'

// import { ethers } from 'ethers'
// import { useWallet } from 'use-wallet'

const CUSTOM_TOKENS = [ defaults.vader, defaults.xvader ]

const Row = ({ children, ...rest }) => {
	return (
		<Flex
			width='100%'
			alignItems='center'
			justifyContent='space-between'
			p={{ base: '12px 24px', md: '0 24px' }}
			minH='60px'
			// cursor='pointer'
			animation='2.3s ease-in-out infinite bgAnimation'
			transition='all 0.3s ease 0s'
			background='rgba(244, 155, 202, 0.08) none repeat scroll 0% 0%'
			mb='16px'
			borderRadius='16px'
			border='1px solid #ffffff10'
			flexWrap='wrap'
			_hover={{
				// cursor: 'pointer',
				background: 'rgba(244, 155, 202, 0.2) none repeat scroll 0% 0%',
				border: '1px solid #ffffff10',
			}}
			{...rest}
		>
			{children}
		</Flex>
	)
}

Row.propTypes = { children: PropTypes.node.isRequired }

const Token = ({ name, logo, address, decimals, symbol, ...rest }) => {
	const [isLargerThan400] = useMediaQuery('(min-width: 380px)')

	console.log('token is larger: ', isLargerThan400)

	return (
		<Row direction={isLargerThan400 ? 'row' : 'column'} {...rest}>
			<Flex marginBottom={!isLargerThan400 ? '10px' : null}>
				<Image
					src={logo}
					alt={`${name} token`}
					width='24px'
					height='24px'
					marginRight='6px'
				/>
				<Box as='h3' margin='0' fontSize='1.02rem' fontWeight='bold'>
					{symbol}
				</Box>
			</Flex>

			{/* #TODO */}
			{/* <Badge colorScheme='green' variant='solid'>Added</Badge> */}

			<Button
				variant='solidRounded'
				size='xs'
				textTransform='uppercase'
				padding="0 10px"
				// disabled
			>
				Add to wallet
			</Button>
		</Row>
	)
}

Token.propTypes = {
	name: PropTypes.string.isRequired,
	logo: PropTypes.string.isRequired,
	address: PropTypes.string.isRequired,
	decimals: PropTypes.number.isRequired,
	symbol: PropTypes.string.isRequired,
}

const Container = ({ children, inverted = false, ...rest }) => {
	return !inverted ? (
		<Flex
			w='100%'
			minH={{ base: 'auto', md: '478.65px' }}
			maxW='50ch'
			margin='0 auto'
			padding={{ base: '2rem 0.9rem', md: '2rem 2.6rem' }}
			layerStyle='colorful'
			flexDir='column'
			{...rest}
		>
			{children}
		</Flex>
	) : (
		<Flex
			maxW='50ch'
			m='0 auto'
			p='1px'
			flexDir='column'
			height='auto'
			layerStyle='colorful'
			backgroundImage='linear-gradient(90deg,rgb(100, 71, 101) 0%,rgb(33, 74, 112) 100%)'
		>
			<Flex
				position='relative'
				width='100%'
				minH='430.4px'
				padding={{ base: '2rem 0.9rem', md: '2rem 2.6rem' }}
				flexDir='column'
				justifyContent='center'
				layerStyle='colorful'
				background='#000000c4;'
				{...rest}
			>
				{children}
			</Flex>
		</Flex>
	)
}

Container.propTypes = {
	children: PropTypes.node.isRequired,
	inverted: PropTypes.bool,
}

const Tokens = ({ inverted = false, ...props }) => {
	const [isSmallDevice] = useMediaQuery('(min-width: 500px)')
	const toast = useToast()
	const wallet = null // useWallet()

	const [activeToken, setToken] = useState(CUSTOM_TOKENS[0])
	const { hasCopied, onCopy } = useClipboard(activeToken.address)

	const onTokenHover = token => { setToken(token) }

	useEffect(() => {
		// trigger copy-pasta toast notification
		if (hasCopied) { toast(copiedContractAddress) }
	}, [hasCopied])

	console.log('[TOKENS] debug : ', { activeToken })

	return (
		<Box
			maxWidth={defaults.layout.container.sm.width}
			m='0 auto'
			p={{ base: '5rem 1.1rem 0', md: '5rem 0 0' }}
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
							name={token.name}
							logo={token.logoURI}
							address={token.address}
							decimals={token.decimals}
							symbol={token.symbol}
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
