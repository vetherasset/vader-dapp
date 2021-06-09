import React, { useState, useEffect } from 'react'
import { Box, Flex, Center, Text } from '@chakra-ui/react'
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

	const [tokens, setTokens] = useState([])
	const [tokenToBurn, setTokenToBurn] = useState(0)
	const [usdvToGet, setUsdvToGet] = useState(0)

	useEffect(()=>{

	}, [])

	return (
		<Box
			maxWidth={defaults.layout.container.sm.width}
			m='0 auto'
		>
			<Flex color='white'>
				<Center w='20%'>
				</Center>
				<Box bg='white' color='black' w='60%' borderWidth='1px' borderRadius='lg' p='2rem'>
					<Text align='center' fontSize='18px' fontWeight='bolder'>
            Asset redemption
					</Text>
					<Text align='center' fontSize='14px' display='block' mb='2rem'>
            Redeem assets by burning your tokens
					</Text>
					<FormControl id='assetToBurn'>
						<FormHelperText>some helper</FormHelperText>
						<FormLabel> Asset amount to burn</FormLabel>
						<FormErrorMessage/>
						<Select placeholder='Select Token' onChange={(e)=>{setTokenToBurn(e.taget.value)}}>
							{tokens.map(t=><option key={t.name} value={t.name}>{t.name}</option>)}
						</Select>
					</FormControl>

				</Box>
				<Center w='20%'>
				</Center>
			</Flex>
		</Box>
	)
}

export default Redeem
