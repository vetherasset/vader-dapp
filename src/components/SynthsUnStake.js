import React from 'react'
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { TriangleDownIcon } from '@chakra-ui/icons'
const SynthsUnStake = ()=>{
	return <Box w="100%">
		<Text fontWeight="bolder">UnStake</Text>
		<Flex layerStyle='inputLike' justifyContent='space-between'>
			<Flex flexDir='column'>
				<Text fontSize='10px' textTransform="uppercase" >Balance 654.00 Vader</Text>
				<Text fontSize="32px">654.00</Text>
			</Flex>
			<Flex flexDir="row" alignItems="center">
				<Text>Max</Text>
				<Image src='https://assets.coingecko.com/coins/images/11375/thumb/vether-symbol-coingecko.png?1622341592'/>
				<Text fontSize="14px">Vader</Text>
				<TriangleDownIcon/>
			</Flex>
		</Flex>
		<Button w="100%" mt="1rem" textTransform="initial">UnStake</Button>
	</Box>
}

export default SynthsUnStake
