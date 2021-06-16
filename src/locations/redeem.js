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
	ListIcon,
} from '@chakra-ui/react'
import vaderIcon from '../static/icons/vader.svg'

import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	Select,
} from '@chakra-ui/react'
import defaults from '../common/defaults'
import axios from 'axios'
import { TriangleDownIcon } from '@chakra-ui/icons'

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
	const fakeTokens = [{
		name: 'Vader',
		value: 'vader',
		icon: 'blue',
	},
	{
		name: 'Vether',
		value: 'vether',
		color: 'pink',
	},
	]
	const [tokens, setTokens] = useState(fakeTokens)
	const [tokenToBurn, setTokenToBurn] = useState('Vader')
	const [burnAmount, setBurnAmount] = useState(0)
	const [tokenToGet, setTokenToGet] = useState('USDV')
	const [tokenAmountToGet, setTokenAmountToGet] = useState(10000)
	const [showTokenList, setShowTokenList] = useState(false)


	const burnToken = () => {
		console.log(tokenToBurn)
		console.log(burnAmount)
	}

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
									<NumberInputField placeholder='0.0' border='none' fontSize="1.5rem"/>
								</NumberInput>
							</Box>
							<Box position='relative' cursor='pointer' onClick={() => setShowTokenList(!showTokenList)}>
								<Box d='flex' alignItems='center'>
									<Image
										width='42px'
										mr='10px'
										src={vaderIcon}
									/>
									<Box as='h3' m='0' fontSize='xl' fontWeight='bold' textTransform='capitalize'>{tokenToBurn}</Box>
									<TriangleDownIcon ml={1} />
								</Box>
								<Box {...(showTokenList ? ShowList : HiddenList)} layerStyle="colorful" padding="1rem" mt=".7rem">
									<List {...ToggleList}>
										{tokens.map(token =>
											<ListItem key={token.name} mb="0.5rem" d="flex" alignItems="center" onClick={()=> setTokenToBurn(token.value)}>
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
						<Box textAlign='center' marginY='15px'>Mint:</Box>
						<Box d='flex' justifyContent='center' alignItems='center'>
							<Box fontSize='1.5rem' fontWeight='bolder' mr="1rem">{tokenAmountToGet}</Box>
							<Image
								width='42px'
								mr='10px'
								src={vaderIcon}
							/>
							<Box fontSize='1.5rem' fontWeight='bolder'>{tokenToGet}</Box>
						</Box>
						<Box d='flex' justifyContent='center' marginY='1.5rem'>
							<Button variant='solidRadial'
								m='0 auto'
								size='lg'
								minWidth='230px'
								textTransform='uppercase'
								color="white"
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
