import React from 'react'
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { TriangleDownIcon } from '@chakra-ui/icons'
const SynthsStake = ()=>{
	return <Box w="100%">
		<Text fontWeight="bolder">Stake</Text>
		<Flex layerStyle='inputLike' justifyContent='space-between'>
			<Flex flexDir='column'>
				<Text fontSize='10px' textTransform="uppercase" >Balance 654.00 Vader</Text>
				<Text fontSize="32px">654.00</Text>
			</Flex>
			<Flex flexDir="row" alignItems="center">
				<Image src='https://assets.coingecko.com/coins/images/11375/thumb/vether-symbol-coingecko.png?1622341592'/>
				<Text fontSize="14px">Vader</Text>
				<TriangleDownIcon/>
			</Flex>
		</Flex>
		<Button w="100%" mt="1rem" textTransform="initial">Stake</Button>
	</Box>
}

export default SynthsStake
