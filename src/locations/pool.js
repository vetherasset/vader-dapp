import React, { useState, useEffect } from 'react'
import { Box, Flex, Input, InputGroup, InputLeftElement, Image, Text, Button } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import defaults from '../common/defaults'
import { pools } from '../assets/dumpdata'
import SortableHeader from '../components/SortableHeader'
import CenteredText from '../components/CenteredText'

const Pools = () => {
	const [tokens, setTokens] = useState([])
	const headers = ['pool', 'pooltype', 'price', 'liguidity', '24H volume', 'apy', 'refresh']

	useEffect(() => {
		setTokens(pools)
	}, [])

	return (
		<Box
			maxWidth={defaults.layout.container.lg.width}
			m='0 auto'
			pt='5rem'>
			<Box>
				<InputGroup border='none'>
					<InputLeftElement
						pointerEvents="none"
					>
						<SearchIcon color="gray.300"/>
					</InputLeftElement>
					<Input borderRadius='none' borderColor='#141414' type="text" placeholder="Search all pools"/>
				</InputGroup>
				<Box>
					<Flex id="header" justify='space-between'
						border='1px solid #141414' p='.5rem' fontSize='.8rem'
						borderTop='none'
					>
						{headers.map(h => <SortableHeader key={h} name={h}/>)}
					</Flex>
					{tokens.map(t => {
						return (
							<Flex border="1px solid #141414" key={t.name} justify='space-between' padding=".5rem"
								justifyContent='center'>
								<CenteredText width="10%">
									<Image width='40px' height='auto' src={t.icon}/>
									<Flex flexDir='column' width="60px" ml="5px">
										<Text>{t.name}</Text>
										<Text>{t.symbol}</Text>
									</Flex>
								</CenteredText>
								<CenteredText casing="uppercase" width="10%">{t.type}</CenteredText>
								<CenteredText width="10%">${t.price}</CenteredText>
								<CenteredText width="10%">${t.liquidity}M</CenteredText>
								<CenteredText width="10%">${t.dayVolume}M</CenteredText>
								<CenteredText width="10%">{t.apy}%</CenteredText>
								<Flex width="40%" justifyContent="flex-end">
									{t.actions.map(a => <Button mx='.5rem' size='sm' key={a}>{a}</Button>)}
								</Flex>
							</Flex>)
					})}
				</Box>
			</Box>
		</Box>
	)
}

export default Pools
