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
	useToast,
	Spinner,
	FormControl,
	FormLabel,
	FormErrorMessage,
} from '@chakra-ui/react'
import vaderIcon from '../static/icons/vader.svg'
import { BigNumber, ethers, utils } from 'ethers'
import defaults from '../common/defaults'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'

import Balance from '../components/Balance'
import { convertToken } from '../common/ethereum'

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

	const toast = useToast()

	const [tokens] = useState(defaultTokens)
	const [tokenToBurn, setTokenToBurn] = useState('vader')
	const [burnAmount, setBurnAmount] = useState(0)
	const [tokenToGet, setTokenToGet] = useState('usdv')
	const [tokenAmountToGet, setTokenAmountToGet] = useState(0)
	const [showTokenList, setShowTokenList] = useState(false)
	const [canBurn, setCanBurn] = useState(false)
	const [totalTokenCanBurn, setTotalTokenCanBurn] = useState(BigNumber.from(0))
	const [submitting, setSubmitting] = useState(false)

	const burnToken = async () => {
		if (totalTokenCanBurn.lte(BigNumber.from(0)) || burnAmount <= 0) {
			return
		}
		if(!canBurn) {
			return
		}
		setSubmitting(true)
		setCanBurn(false)
		try{
			const result = await convertToken({ name: tokenToBurn, amount: String(burnAmount) })
			if(result && result.hash) {
				toast({
					title: 'Transaction submitted',
					description: <Box wordBreak="break-all">You can check the result later on Etherscan with tx id: <p>{result.hash}</p></Box>,
					status: 'success',
					duration: 9000,
					isClosable: true,
					position: 'top',
				})
			}
			else{
				toast({
					title: 'Error',
					description: 'An error occurred, please try again later',
					status: 'error',
					duration: 9000,
					isClosable: true,
					position: 'top',
				})
			}
		}
		catch (e) {
			let description = 'An error occurred, please try again later'
			if(e && e.code === 4001) {
				description = 'Seems you rejected the transaction'
			}
			toast({
				title: 'Error',
				description,
				status: 'error',
				duration: 9000,
				isClosable: true,
				position: 'top',
			})
		}
		finally {
			setSubmitting(false)
		}
	}

	const calculateBurn = (e) => {
		let { value } = e.target
		if(isNaN(value) || !value) {
			value = 0
		}
		setBurnAmount(value)
	}

	const getTokenNameByValue = (value) => {
		return tokens.find(token => token.value === value).name
	}

	const setBurnTokenTotalValue = (value)=>{
		setTotalTokenCanBurn(value)
	}

	useEffect(() => {
		setTokenToGet(burnPair[tokenToBurn])
	}, [tokenToBurn])

	useEffect(()=>{
		const bigBurnAmount = utils.parseUnits(String(burnAmount))
		setCanBurn(totalTokenCanBurn > 0 && burnAmount > 0 && bigBurnAmount.lte(totalTokenCanBurn))
	}, [burnAmount, tokenToBurn, totalTokenCanBurn])

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
												/>
												{token.name}
											</ListItem>,
										)}
									</List>
								</Box>
							</Box>
						</Flex>
						<Box textAlign='left' margin='15px'>
							<Balance tokenName={tokenToBurn} setBurnTokenTotalValue={setBurnTokenTotalValue}/>
						</Box>
						<Box textAlign='center' marginY='15px'>Mint:</Box>
						<Box d='flex' justifyContent='center' alignItems='center'>
							<Box fontSize='1.5rem' fontWeight='bolder' mr='1rem'>{tokenAmountToGet}</Box>
							<Image
								width='42px'
								mr='10px'
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
								disabled={!canBurn}
								onClick={burnToken}>
								<Spinner display={submitting ? 'block' : 'none'} mr="1rem"/>
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
