import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import {
	Box, Flex, Badge, Text, Button, Image, Divider, IconButton,
	useBreakpointValue, useMediaQuery, useToast,
} from '@chakra-ui/react'
import { ChevronDownIcon, CopyIcon } from '@chakra-ui/icons'

import defaults from '../common/defaults'
import { copiedAddress } from '../messages'

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

// const Container = () => {
// 	return (
// 		<>row here bro?</>
// 	)
// }

const Token = ({ name, logo, address, decimals, symbol }) => {
	const [isLargerThan400] = useMediaQuery('(min-width: 380px)')

	console.log('token is larger: ', isLargerThan400)

	return (
		<Row direction={isLargerThan400 ? 'row' : 'column'}>
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

const Card = ({ children, ...rest }) => {
	return (
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
	)
}

Card.propTypes = {
	children: PropTypes.node.isRequired,
}

const Container = ({ children, ...rest }) => {
	return (
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
				// p='1.5rem 0 4.5rem'
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
}

const Tokens = ({ inverted = false, ...props }) => {
	const wallet = null; // useWallet()
	const toast = useToast()

	const [isLargerThan500] = useMediaQuery('(min-width: 500px)')
	const variant = useBreakpointValue({ base: 'test', lg: 'haha' })
	// const wallet = null

	const testCopyPasta = () => {
		console.log('@@@ COPY ME ! @@@')
		toast(copiedAddress)
	}

	console.log('[TOKENS] wallet : ', { wallet, variant })

	const Node = inverted ? Container : Card;

	return (
		<Box
			// minHeight={`calc(90vh - ${defaults.layout.header.minHeight})`}
			maxWidth={defaults.layout.container.sm.width}
			m='0 auto'
			p={{ base: '5rem 1.1rem 0', md: '5rem 0 0' }}
			{...props}
		>
			{/* <Card padding='2rem 0.9rem'> */}
			{/* <Container padding='2rem 0.9rem'> */}
			<Node padding='2rem 0.9rem'>
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

				{/* TOKENS */}
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

				{/* <Row> */}
				<Row>
					<Flex
						width='100%'
						margin='20px 0'
						direction={isLargerThan500 ? 'row' : 'column'}
						alignItems={!isLargerThan500 ? 'center' : null}
					>
						{/* LOGO */}
						<Box
							flexShrink='0'
							marginRight={isLargerThan500 ? '8px' : null}
							marginBottom={!isLargerThan500 ? '16px' : null}
						>
							<Image
								src={CUSTOM_TOKENS[0].logoURI}
								alt={`${CUSTOM_TOKENS[0].name} token`}
								width='60px'
								height='60px'
							/>
						</Box>

						{/* BADGES */}
						<Flex
							width='100%'
							flexWrap='wrap'
							alignContent='center'
							justifyContent={!isLargerThan500 ? 'space-evenly' : null}
							gridGap='4px'
						>
							<Badge
								width="100%"
								onClick={testCopyPasta}
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
									{/* <IconButton variant='' aria-label='Copy address' icon={<CopyIcon color='#fff' _hover={{ color: '#f79ddc' }}/>} /> */}
									&nbsp;
									Address:
								</span>
								<Box ></Box>
								<div
									style={{
										textOverflow: 'clip',
										overflow: 'hidden',
										// MozSelection: { background: 'magenta' },
										// '::-moz-selection': { background: 'yellow' },
										// '::selection': { background: 'yellow' },
									}}>
									0x2602278EE1882889B946eb11DC0E810075650983
								</div>
							</Badge>
							<Badge background='rgba(0, 0, 0, 0.16)'>Name: Vader</Badge>
							<Badge background='rgba(0, 0, 0, 0.16)'>Symbol: VADER</Badge>
							<Badge background='rgba(0, 0, 0, 0.16)'>Decimals: 18</Badge>
						</Flex>
					</Flex>
				</Row>
				{/* </Row> */}

				{/* <Flex marginTop='0.7rem'>
					<Button
						variant='outline'
						size='lg'
						textTransform='none'
						leftIcon={<Image
							width='24px'
							height='24px'
							src={defaults.xvader.logoURI}
							alt={`${defaults.xvader.name} token`}
						/>}
					>
						wtf??
					</Button>
				</Flex> */}
				{/* </Card> */}
				{/* </Container> */}
			</Node>
		</Box>
	)
}

Tokens.propTypes = {
	inverted: PropTypes.bool,
}

export default Tokens
