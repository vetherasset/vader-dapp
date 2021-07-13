import React, { useState, useEffect } from 'react'
import { Box, Flex, Input, InputGroup, InputLeftElement, Image, Text, Button } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import defaults from '../common/defaults'
import { pools } from '../assets/dumpdata'
import SortableHeader from '../components/SortableHeader'
import CenteredText from '../components/CenteredText'

const Pools = () => {
	const headers = [
		{
			name: 'name',
			text: 'pool',
		},
		{
			name: 'type',
			text: 'pooltype',
		},
		{
			name: 'price',
			text: 'price',
		},
		{
			name: 'liquidity',
			text: 'liquidity',
		},
		{
			name: 'dayVolume',
			text: '24H volume',
		},
		{
			name: 'apy',
			text: 'apy',
		},
		{
			name: 'refresh',
			text: 'refresh',
		},
	]
	const [tokens, setTokens] = useState([])
	const [filteredToken, setFilteredToken] = useState([])
	const [currentOrderKey, setCurrentOrderKey] = useState('')
	const [currentOrder, setCurrentOrder] = useState('')
	const [currentQuery, setCurrentQuery] = useState('')

	useEffect(() => {
		setTokens(pools)
		setFilteredToken(pools)
	}, [])

	const sortPool = (headerKey, desc)=>{
		if(currentOrderKey === headerKey && currentOrder === desc) {
			return
		}
		setCurrentOrderKey(headerKey)
		setCurrentOrder(desc)
		const isDesc = desc === 'desc'
		const sortedTokens = tokens.sort((tokenA, tokenB)=>{
			if(isNaN(tokenA[headerKey])) {
				return (tokenA[headerKey] > tokenB[headerKey]) ? (isDesc ? 1 : -1) : (isDesc ? -1 : 1)
			}
			return (Number(tokenA[headerKey]) > Number(tokenB[headerKey])) ? (isDesc ? 1 : -1) : (isDesc ? -1 : 1)
		})
		setFilteredToken(sortedTokens)
	}

	const searchToken = query=>{
		const trimmedQuery = query.trim()
		if(currentQuery === trimmedQuery) {
			return
		}
		setCurrentQuery(trimmedQuery)
		if(!trimmedQuery) {
			setFilteredToken(tokens)
			return
		}
		setFilteredToken(tokens.filter(t=> t.name.toLowerCase().includes(query.trim().toLowerCase())))
	}

	const handleActionButton = (action, token) =>{
		console.log(action, token)
	}

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
					<Input borderRadius='none' borderColor='#141414' type="text" placeholder="Search all pools" onChange={(e)=>{searchToken(e.target.value)}}/>
				</InputGroup>
				<Box>
					<Flex id="header" justify='space-between'
						border='1px solid #141414' p='.5rem' fontSize='.8rem'
						borderTop='none'
					>
						{headers.map((h, i) => <SortableHeader key={h.name} name={h.name} text={h.text} index={i} sortHandler={e=>{sortPool(h.name, e)}}/>)}
					</Flex>
					{filteredToken.map(t => {
						return (
							<Flex border="1px solid #141414" key={t.name} justify='space-between' padding=".5rem"
								justifyContent='center'>
								<CenteredText width="10%" display={{ base: 'flex' }}>
									<Image width='40px' height='auto' src={t.icon}/>
									<Flex flexDir='column' width="60px" ml="5px">
										<Text>{t.name}</Text>
										<Text>{t.symbol}</Text>
									</Flex>
								</CenteredText>
								<CenteredText width="10%" display={{ base: 'none', lg: 'flex' }}>{t.type}</CenteredText>
								<CenteredText width="10%" display={{ base: 'none', lg: 'flex' }}>${t.price}</CenteredText>
								<CenteredText width="10%" display={{ base: 'none', md: 'flex' }}>${t.liquidity}M</CenteredText>
								<CenteredText width="10%" display={{ base: 'none', md: 'flex' }}>${t.dayVolume}M</CenteredText>
								<CenteredText width="10%" display={{ base: 'none', md: 'flex' }}>{t.apy}%</CenteredText>
								<Flex width="40%" justifyContent="flex-end">
									{t.actions.map(a => <Button mx='.5rem' size='sm' key={a} onClick={()=>{handleActionButton(a, t)}}>{a}</Button>)}
								</Flex>
							</Flex>)
					})}
				</Box>
			</Box>
		</Box>
	)
}

export default Pools
