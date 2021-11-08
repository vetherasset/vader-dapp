import React, { useMemo, useState, useEffect } from 'react'
import { useWallet } from 'use-wallet'
import { useLazyQuery, gql } from '@apollo/client'
import { useNftitems } from '../hooks/useNftitems'
import { Link } from 'react-router-dom'
import { Box, Button, Flex, Text, Spinner } from '@chakra-ui/react'
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons'
import { Position } from '../components/Position'
import defaults from '../common/defaults'

const Pool = (props) => {

	const wallet = useWallet()
	const [nftItems, loading, setSkip] = useNftitems()
	const nftItemsMemo = useMemo(() => nftItems, [nftItems])

	const [page, setPage] = useState(0)
	const [positionsPerPage] = useState(5)
	const [pageCount, setPageCount] = useState(0)

	const NoLiquidityMessage = () => {
		return (
			<>
				<Text fontSize='1.1rem' color='#adadb0'>You&lsquo;re currently providing no liquidity.</Text>
				<Link to='/pool/deposit'>
					<Text fontSize='1.1rem' color='#3384ca' fontStyle='italic' cursor='pointer'>Go ahead, add some!</Text>
				</Link>
			</>
		)
	}

	const positionsCount = gql`
		query Items(
			$account: String!
		) {
			nftitems(
							first: 1,
							skip: 0,
							orderBy: tokenId,
							orderDirection: desc,
							where: {owner: $account})
						{
							position {
								id
							}
						}
			}
	`

	const [fetch, { data }] = useLazyQuery(positionsCount)

	const paginationButton = (pageNumber, name, enabled = true) => {
		return (
			<Button
				variant='ghost'
				key={pageNumber}
				color={page == pageNumber ? 'accent.100' : 'white'}
				textDecor={page == pageNumber ? 'underline' : 'none'}
				style={{
					boxShadow: 'none',
					fontWeight: page == pageNumber ? 'bold' : 'normal',
				}}
				disabled={ !enabled }
				onClick={() => {
					 setPage(Number(pageNumber))
					 setSkip(Number(pageNumber * positionsPerPage))
				}}>
				{ name }
			</Button>
		)
	}

	useEffect(() => {
		if(wallet.account) {
			fetch({ variables: {
				account: String(wallet.account).toLocaleLowerCase(),
			} })
		}
	}, [wallet.account])

	useEffect(() => {
		if(wallet.account && data && data.nftitems[0]) {
			setPageCount(Math.ceil(Number(data?.nftitems[0].position[0].id) / positionsPerPage))
		}
	}, [positionsPerPage, data, wallet.account])

	return (
		<Box
			height={`calc(100vh - ${defaults.layout.header.minHeight})`}
			maxWidth={defaults.layout.container.md.width}
			m='0 auto'
			p={{ base: '5rem 1.2rem 0', md: '5rem 0 0' }}
			{...props}
		>
			<Flex
				m='0 auto'
				p='1.8rem'
				flexDir='row'
				height='auto'
				justifyContent='space-between'
			>
				<Text
					as='h4'
					fontSize='1.24rem'
					fontWeight='bolder'>
						Liquidity
				</Text>
				<Link to='/pool/deposit'>
					<Button
						variant='outlineAlter'
						height='2.2rem'
						padding='0'
						alignItems='center'
						backgroundSize='150%'
					>
						<Box
							display='inline-flex'
							alignItems='center'
							justifyContent='center'
							borderRadius='12px'
							background='#000'
							height='100%'
							p='0 1rem'
						>
							<span>Deposit</span>
						</Box>
					</Button>
				</Link>
			</Flex>
			<Flex
				m='0 auto'
				p='1px'
				flexDir='column'
				height='auto'
				mb='98.4px'
				layerStyle='colorful'
				backgroundImage='linear-gradient(90deg,rgb(100, 71, 101) 0%,rgb(33, 74, 112) 100%)'
			>
				<Flex
					width='100%'
					layerStyle='colorful'
					background='#000000c4;'
					minH='430.4px'
					p='1.5rem 0 4.5rem'
					flexDir='column'
					justifyContent='center'
					position='relative'
				>
					<Box
						p='0 20px'
						display={ ((!nftItemsMemo?.length > 0) && (!loading)) || loading ? 'flex' : 'block'}
						flexDir='column'
						justifyContent='center'
						textAlign='center'
						alignItems='center'
						minH='430.4px'
					>
						{wallet.account && data && data.nftitems[0] && !loading &&
						<Flex
							width='100%'
							alignItems='center'
							justifyContent='space-between'
							p='0 12px'
							minH='34.4px'
							mb='1rem'
						>
							<>
								<Flex>
									<Text
										as='h4'
										fontSize='1.1rem'
										fontWeight='bolder'>
											Position
									</Text>
								</Flex>
								<Flex>
									<Text
										as='h4'
										fontSize='1.1rem'
										fontWeight='bolder'>
											Value
									</Text>
								</Flex>
							</>
						</Flex>
						}
						{loading &&
							<Spinner size='lg' />
						}
						{nftItemsMemo?.map((item, index) => {
							return (
								<Position key={index} position={item.position[0]} foreignTokenAddress={item.position[0].foreignAsset.address}/>
							)
						})}
						{(typeof nftItemsMemo === 'undefined' && !wallet.account) &&
									<NoLiquidityMessage/>
						}
						{(wallet.account && typeof nftItemsMemo !== 'undefined' && !nftItemsMemo?.length > 0 && !loading) &&
									<NoLiquidityMessage/>
						}
					</Box>
					{wallet.account && data && data.nftitems[0] && !loading &&
					<Flex
						flexDir='row'
						alignItems='center'
						justifyContent='center'
						minH='40px'
						position='absolute'
						left='50%'
						transform='translateX(-50%)'
						bottom='0'
						marginBottom='1.5rem'
					>
						{data && pageCount > 0 && !loading &&
								<>
									{ paginationButton(page - 1, <ChevronLeftIcon/>, page > 0) }
									{
										[...Array(pageCount)].map((_key, index) => {
											if ((page < 4 && index < 5) || (page > pageCount - 5 && index > pageCount - 6)
							|| index == 0 || index == pageCount - 1
							|| index == page - 1 || index == page || index == page + 1) {
												return paginationButton(index, index + 1)
											}
											else if (index == page - 2) {
												return paginationButton(index, '...')
											}
											else if (index == pageCount - 6 && page > pageCount - 5) {
												return paginationButton(index, '...')
											}
											else if (index == page + 2) {
												return paginationButton(index, '...')
											}
											else if (index == 5 && page < 4) {
												return paginationButton(index, '...')
											}
										})
									}
									{ paginationButton(page + 1, <ChevronRightIcon/>, (page + 1) * positionsPerPage < Number(data?.nftitems[0].position[0].id) - 0) }
								</>
						}
					</Flex>
					}
				</Flex>
			</Flex>
		</Box>
	)
}

export default Pool
