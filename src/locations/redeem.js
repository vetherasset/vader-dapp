import React, { useState, useEffect } from 'react'
import {
	Box,
	Flex,
	Text,
	Button,
	NumberInput,
	NumberInputField,
	Image,
	List,
	ListItem,
} from '@chakra-ui/react'
import vaderIcon from '../static/icons/vader.svg'

import { useWallet } from 'use-wallet'
import {
	FormControl,
	FormLabel,
	FormErrorMessage,
} from '@chakra-ui/react'
import defaults from '../common/defaults'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'

import Balance from '../components/Balance'
import { convertToken } from '../common/ethereum'
import { ethers } from 'ethers'

const HiddenList = {
	visibility: 'hidden',
	opacity: 0,
	display: 'none',
}

const ShowList = {
	position: 'absolute',
	transition: 'all 0.5s ease',
	marginTop: '1rem',
	left: 0,
}

const ToggleList = {
	visibility: 'visible',
	opacity: 1,
	display: 'block',
}


export const Redeem = () => {
	const defaultTokens = [
		{
			name: 'Vader',
			value: 'vader',
		},
		{
			name: 'Vether',
			value: 'vether',
		},
		{
			name: 'USDV',
			value: 'usdv',
		},
	]

	const burnPair = {
		'vader': 'usdv',
		'usdv': 'vader',
		'vether': 'vader',
	}

	const [tokens] = useState(defaultTokens)
	const [tokenToBurn, setTokenToBurn] = useState('vader')
	const [burnAmount, setBurnAmount] = useState(0)
	const [tokenToGet, setTokenToGet] = useState('usdv')
	const [tokenAmountToGet, setTokenAmountToGet] = useState(0)
	const [showTokenList, setShowTokenList] = useState(false)

	const burnToken = async () => {
		if (tokenToBurn < 0 || burnAmount < 0) {
			return
		}
		const result = await convertToken({ name: tokenToBurn, amount: burnAmount.toString() })
		console.log(result)
	}

	const calculateBurn = (e) => {
		const amount = Number(e.target.value)
		if (!amount || amount <= 0) {
			return
		}
		setBurnAmount(amount)
	}

	const getTokenNameByValue = (value) => {
		return tokens.find(token => token.value === value).name
	}

	useEffect(() => {
		setTokenToGet(burnPair[tokenToBurn])
	}, [tokenToBurn])


	return (
		<Box
			maxWidth={defaults.layout.container.sm.width}
			m='0 auto'
			pt='5rem'
		>
			<Flex
				justifyContent='center'
				layerStyle='colorful'
				maxW='49ch'
				m='0 auto'
				p='1.8rem'
			>
				<Box>
					<Text align='center' fontSize='1.5rem' fontWeight='bolder'>
            Asset redemption
					</Text>
					<Text align='center' fontSize='1.2rem' display='block' mb='2rem'>
            Redeem assets by burning your tokens
					</Text>
					<FormControl id='assetToBurn'>
						<FormLabel fontSize='1.2rem' fontWeight='bolder'> Asset amount to burn</FormLabel>
						<FormErrorMessage />
						<Flex layerStyle='inputLike'>
							<Box flex='1' pr='0.5rem'>
								<NumberInput>
									<NumberInputField placeholder='0.0' border='none' fontSize='1.5rem' onChange={calculateBurn} />
								</NumberInput>
							</Box>
							<Box position='relative' cursor='pointer' onClick={() => setShowTokenList(!showTokenList)}>
								<Box d='flex' alignItems='center'>
									<Image
										width='42px'
										mr='10px'
										src={vaderIcon}
									/>
									<Box as='h3' m='0' fontSize='xl' fontWeight='bold'
										textTransform='capitalize'>{getTokenNameByValue(tokenToBurn)}</Box>
									{!showTokenList ? <TriangleDownIcon ml={1} /> : <TriangleUpIcon ml={1} />}
								</Box>
								<Box {...(showTokenList ? ShowList : HiddenList)} layerStyle='colorful' padding='1rem' mt='.7rem'
									zIndex='2'>
									<List {...ToggleList}>
										{tokens.map(token =>
											<ListItem key={token.name} mb='0.5rem' d='flex' alignItems='center'
												onClick={() => {
													setTokenToBurn(token.value)
												}}>
												<Image
													width='42px'
													mr='10px'
													src={vaderIcon}
												/>
												{token.name}
											</ListItem>,
										)}
									</List>
								</Box>
							</Box>
						</Flex>
						<Box textAlign='left' margin='15px'>
							<Balance tokenName={tokenToBurn}/>
						</Box>
						<Box textAlign='center' marginY='15px'>Mint:</Box>
						<Box d='flex' justifyContent='center' alignItems='center'>
							<Box fontSize='1.5rem' fontWeight='bolder' mr='1rem'>{tokenAmountToGet}</Box>
							<Image
								width='42px'
								mr='10px'
								src={vaderIcon}
							/>
							<Box fontSize='1.5rem' fontWeight='bolder'>{getTokenNameByValue(tokenToGet)}</Box>
						</Box>
						<Box d='flex' justifyContent='center' marginY='1.5rem'>
							<Button variant='solidRadial'
								m='0 auto'
								size='lg'
								minWidth='230px'
								textTransform='uppercase'
								color='white'
								onClick={burnToken}>
                Burn
							</Button>
						</Box>
					</FormControl>
				</Box>
			</Flex>
		</Box>
	)
}

export default Redeem
