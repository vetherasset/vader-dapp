import React, { useState, useEffect } from 'react'
import { Box, Flex, Text, Input, Button } from '@chakra-ui/react'
import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	FormHelperText,
	Select,
} from '@chakra-ui/react'
import defaults from '../common/defaults'
import axios from 'axios'

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
	const [tokenToBurn, setTokenToBurn] = useState('')
	const [burnAmount, setBurnAmount] = useState(0)
	const [usdvToGet, setUsdvToGet] = useState(0)


	const burnToken = () => {
	  console.log(tokenToBurn)
		console.log(burnAmount)
	}

	return (
		<Box
			maxWidth={defaults.layout.container.sm.width}
			m='0 auto'
		>
			<Flex color='white' justifyContent='center'>
				<Box bg='white' color='black'
					borderWidth='1px' borderRadius='lg' p='2rem' width={{ base: '100%', md: '80%', lg: '70%' }}>
					<Text align='center' fontSize='18px' fontWeight='bolder'>
            Asset redemption
					</Text>
					<Text align='center' fontSize='14px' display='block' mb='2rem'>
            Redeem assets by burning your tokens
					</Text>
					<FormControl id='assetToBurn'>
						<FormHelperText>some helper</FormHelperText>
						<FormLabel> Asset amount to burn</FormLabel>
						<FormErrorMessage />
						<Box border='1px' d='flex' borderRadius='8px'>
							<Select placeholder='Select Token' w='40%' style={{ textTransform: 'uppercase' }}
								_hover={{ border: 'none' }} _focus={{ border: 'none' }}
								onChange={(e) => {
									setTokenToBurn(e.target.value)
								}}>
								{tokens.map(t => <option value={t.name} key={t.name}>{t.name}</option>,
								)}
							</Select>
							<Input w='60%' border={{ base: 'none' }} type='number' value={burnAmount}
								textAlign='right' _hover={{ border: 'none' }} _focus={{ border: 'none' }}
								onInput={(e) => {
									setBurnAmount(Number(e.target.value))
								}} />
						</Box>
						<Box textAlign='center' marginY='15px'>...mint</Box>
						<Box d='flex' justifyContent='center' alignItems='center'>
							<Box as='span' marginX='1rem' _before={{
								content: '" "',
								width: '1.5rem',
								height: '1.5rem',
								backgroundColor: 'pink',
								borderRadius: '.75rem',
								display: 'block',
							}} />
							<Text fontSize='2rem'>{usdvToGet} USDV</Text>
						</Box>
						<Box d='flex' justifyContent='center' marginY='1.5rem'>
							<Button w='100%' fontSize="2rem" padding="1rem" height="4rem" onClick={burnToken}>Burn</Button>
						</Box>
					</FormControl>
				</Box>
			</Flex>
		</Box>
	)
}

export default Redeem
