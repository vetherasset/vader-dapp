import React from 'react'
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { TriangleDownIcon } from '@chakra-ui/icons'
const SynthsMint = ()=>{
	return <Box w="100%">
		<Flex layerStyle='inputLike' justifyContent='space-between'>
			<Flex flexDir='column'>
				<Text fontSize='10px' textTransform="uppercase" >Balence 654.00 COMP</Text>
				<Text fontSize="32px">654.00</Text>
			</Flex>
			<Flex flexDir="row" alignItems="center">
				<Image src='https://assets.coingecko.com/coins/images/11375/thumb/vether-symbol-coingecko.png?1622341592'/>
				<Text fontSize="14px">COMP</Text>
				<TriangleDownIcon/>
			</Flex>
		</Flex>
		<Flex textAlign="center" mt="1rem" justifyContent="center" alignItems="center">
			<Text fontWeight="bolder" mx=".5rem">mints</Text>
			<Text fontSize="20px" fontWeight="bolder" mx=".5rem">6540.00</Text>
			<Image mx=".2rem" src='https://assets.coingecko.com/coins/images/11375/thumb/vether-symbol-coingecko.png?1622341592'/>
			<Text fontSize="14px" mx=".2rem">VCOMP</Text>
		</Flex>
		<Button w="100%" mt="1rem" textTransform="initial">Mint</Button>
	</Box>
}

export default SynthsMint
