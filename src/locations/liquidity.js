import React, { useState, useEffect } from 'react'
import { Box, Flex, Input, InputGroup, InputLeftElement, Image, Text, Button } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import defaults from '../common/defaults'
import { pools } from '../assets/dumpdata'
import SortableHeader from '../components/SortableHeader'

const Liquidity = (props) => {
	const headers = [
		{
			name: 'name',
			text: 'pool',
			style: {
				display: { base: 'flex' },
				width: { base: '30%', md: '10%' },
			},
		},
		{
			name: 'type',
			text: 'type',
			style: {
				display: { base: 'none', lg: 'flex' },
				width: { base: '30%', md: '10%' },
			},

		},
		{
			name: 'price',
			text: 'price',
			style: {
				display: { base: 'none', lg: 'flex' },
				width: { base: '30%', md: '10%' },
			},

		},
		{
			name: 'liquidity',
			text: 'liquidity',
			style: {
				display: { base: 'none', md: 'flex' },
				width: { base: '30%', md: '10%' },
			},

		},
		{
			name: 'dayVolume',
			text: '24H VOL',
			style: {
				display: { base: 'none', md: 'flex' },
				width: { base: '30%', md: '10%' },
			},

		},
		{
			name: 'apy',
			text: 'apy',
			style: {
				display: { base: 'none', md: 'flex' },
				width: { base: '30%', md: '10%' },
			},

		},
		{
			name: 'refresh',
			text: 'refresh',
			style: {
				justifyContent: 'right',
				display: { base: 'flex' },
				width: { base: '70%', md: '40%' },
			},

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

	const sortPool = (headerKey, desc) => {
		if (currentOrderKey === headerKey && currentOrder === desc) {
			return
		}
		setCurrentOrderKey(headerKey)
		setCurrentOrder(desc)
		const isDesc = desc === 'desc'
		const sortedTokens = tokens.sort((tokenA, tokenB) => {
			if (isNaN(tokenA[headerKey])) {
				return (tokenA[headerKey] > tokenB[headerKey]) ? (isDesc ? 1 : -1) : (isDesc ? -1 : 1)
			}
			return (Number(tokenA[headerKey]) > Number(tokenB[headerKey])) ? (isDesc ? 1 : -1) : (isDesc ? -1 : 1)
		})
		setFilteredToken(sortedTokens)
	}

	const searchToken = query => {
		const trimmedQuery = query.trim()
		if (currentQuery === trimmedQuery) {
			return
		}
		setCurrentQuery(trimmedQuery)
		if (!trimmedQuery) {
			setFilteredToken(tokens)
			return
		}
		setFilteredToken(tokens.filter(t => t.name.toLowerCase().includes(query.trim().toLowerCase())))
	}

	const handleActionButton = (action, token) => {
		console.log(action, token)
	}

	return (
		<Box
			height={`calc(100vh - ${defaults.layout.header.minHeight})`}
			maxWidth={defaults.layout.container.lg.width}
			m='0 auto'
			pt='5rem'
			{...props}
		>
			<Flex
				minH='478.65px'
				m='0 auto'
				p='1.8rem'
				flexDir='column'
			>

				<Box
					w='100%'
					maxWidth='49ch'
					m='0 auto'
				>
					<Box as='h3' fontSize='1.3rem' fontWeight='bold' textTransform='capitalize'>Liquidity</Box>
					<InputGroup
						mb='5rem'>
						<InputLeftElement
							w='2.9rem'
							pointerEvents='none'
						>
							<SearchIcon/>
						</InputLeftElement>
						<Input
							variant='filled'
							type='text'
							placeholder='Search all pools'
							onChange={(e) => {
								searchToken(e.target.value)
							}}/>
					</InputGroup>
				</Box>

				<Box
					mb='5rem'
					p='1.8rem'
				>
					<Flex
						id='header'
						justify='space-between'
						fontSize='.8rem'
						p='.5rem'
					>
						{headers.map(h => <SortableHeader
							key={h.name}
							name={h.name}
							text={h.text}
							display={h.style}
							sortHandler={e => {
								sortPool(h.name, e)
							}}/>)}
					</Flex>
					{filteredToken.map(t => {
						return (
							<Flex
								key={t.name}
								justify='space-between'
								padding='.5rem'
							>
								<Flex alignItems='center' width={{ base: '30%', md: '10%' }}
									flexWrap='wrap'>
									<Flex d='flex' flexDir='row'>
										<Image
											bg='white'
											borderRadius='50%'
											objectFit='none'
											width='23px'
											height='23px'
											src={t.icon}/>
										<Flex flexDir='column' width='60px' ml='5px'>
											<Text>{t.symbol}</Text>
										</Flex>
									</Flex>
									<Flex d='flex' flexDir='row'>
										<Image
											bg='white'
											borderRadius='50%'
											objectFit='none'
											width='23px'
											height='23px'
											src={t.icon}/>
										<Flex flexDir='column' width='60px' ml='5px'>
											<Text>{t.symbol}</Text>
										</Flex>
									</Flex>
								</Flex>
								<Flex alignItems='center' width='10%' display={{ base: 'none', lg: 'flex' }}>{t.type}</Flex>
								<Flex alignItems='center' width='10%' display={{ base: 'none', lg: 'flex' }}>${t.price}</Flex>
								<Flex alignItems='center' width='10%'
									display={{ base: 'none', md: 'flex' }}>${t.liquidity}M</Flex>
								<Flex alignItems='center' width='10%'
									display={{ base: 'none', md: 'flex' }}>${t.dayVolume}M</Flex>
								<Flex alignItems='center' width='10%' display={{ base: 'none', md: 'flex' }}>{t.apy}%</Flex>
								<Flex alignItems='center' width={{ base: '70%', md: '40%' }} justifyContent='flex-end'>
									{t.actions.map(a => <Button mx='.5rem' size='sm' key={a} onClick={() => {
										handleActionButton(a, t)
									}}>{a}</Button>)}
								</Flex>
							</Flex>)
					})}
				</Box>
			</Flex>
		</Box>
	)
}

export default Liquidity
