import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ethers } from 'ethers'
import { useWallet } from 'use-wallet'
import { Link, useParams } from 'react-router-dom'
import { Box, Button, Flex, Text, InputGroup, Input, InputRightAddon, Image, Spinner,
	useToast, Checkbox } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { tokenValueTooSmall } from '../messages'
import defaults from '../common/defaults'

const flex = {
	flex: '1',
}

const input = {
	variant: 'transparent',
}

const field = {
	fontSize: '1.3rem',
	fontWeight: 'bold',
}

const Bond = (props) => {

	const wallet = useWallet()
	const { address } = useParams()
	const toast = useToast()

	const [bond, setBond] = useState([])
	const [token0, setToken0] = useState(false)
	const [token0Approved, setToken0Approved] = useState(false)
	const [token0amount, setToken0amount] = useState(0)
	const [token0balance, setToken0balance] = useState(0)
	const [token1, setToken1] = useState(defaults.nativeAsset)
	const [token1Approved, setToken1Approved] = useState(false)
	const [token1amount, setToken1amount] = useState(0)
	const [token1balance, setToken1balance] = useState(0)
	const [working, setWorking] = useState(false)


	useEffect(() => {
		setBond(defaults.bonds?.available?.filter((b) => {
			return b.address === address
		}))
	}, [address])

	return (
		<>
			<Box
				minHeight={`calc(90vh - ${defaults.layout.header.minHeight})`}
				maxWidth={defaults.layout.container.md.width}
				m='0 auto'
				p={{ base: '5rem 1.1rem 0', md: '5rem 0 0' }}
				{...props}
			>
		 <Flex
					m='0 auto'
					p='1.8rem'
					flexDir='row'
					height='auto'
					justifyContent='space-between'
				>
					<Link
						to='/bond'
					>
						<Button
							variant='ghost'
							minW='auto'
							width='32px'
							height='32px'
							p='0'
						>
							<ArrowBackIcon
								width='26px'
								height='26px'
							/>
						</Button>
					</Link>
					<Text
						as='h4'
						fontSize='1.24rem'
						fontWeight='bolder'>
						{bond[0]?.token0?.symbol && bond[0]?.token1?.symbol &&
							<>
								{`${bond[0].token0.symbol}-${bond[0].token1.symbol} ${bond[0].name} ${bond[0].liquidityPosition ? 'LP' : '' }`}
							</>
						}
					</Text>
					<Box
						as='button'
						width='22px'
					>
						{/* empty :-) */}
					</Box>
				</Flex>
				<Flex
					m='0 auto'
					flexDir='column'
					layerStyle='colorful'
					height='auto'
					minH='526.4px'
				>
					<Flex
						minH='526.4px'
						height='100%'
						flexWrap={{ base: 'wrap', md: 'nowrap' }}
					>
						<Flex
							flexDir='column'
							height='100%'
							width={{ base: '100%', md: '50%' }}
						>
							<BondPanel/>
						</Flex>
					</Flex>
				</Flex>
			</Box>
		</>
	)
}

const BondPanel = (props) => {

	BondPanel.propTypes = {
		exchangeRate: PropTypes.any.isRequired,
		balance: PropTypes.object.isRequired,
		refreshData: PropTypes.func,
	}

	const wallet = useWallet()
	const toast = useToast()
	const [value, setValue] = useState(0)
	const [inputAmount, setInputAmount] = useState('')
	const [token0] = useState(
		{
			'name':'ETHER',
			'symbol':'ETH',
			'decimals':18,
			'logoURI':'https://raw.githubusercontent.com/vetherasset/branding/main/vader/vader-symbol-w-ring.png',
		},
	)
	const [token0Approved, setToken0Approved] = useState(false)
	const [working, setWorking] = useState(false)

	return (
		<>
			<Flex
				p='0 1.8rem'
				paddingBottom='1.8rem'
				flexDir='column'>
				<Flex
					alignItems="center"
					justifyContent="space-between">
					<Text
						as='h4'
						fontSize={{ base: '1rem', md: '1.24rem' }}
						fontWeight='bolder'>
							Amount
					</Text>
				</Flex>
				<Flex
					layerStyle='inputLike'
				>
					<InputGroup>
						<Input
							variant='transparent'
							flex='1'
							fontSize='1.3rem'
							fontWeight='bold'
							placeholder='0.0'
							value={inputAmount}
							onChange={(e) => {
								if (isNaN(e.target.value)) {
									setInputAmount(prev => prev)
								}
								else {
									setInputAmount(String(e.target.value))
									if(Number(e.target.value) > 0) {
										try {
											setValue(ethers.utils.parseUnits(String(e.target.value), token0.decimals))
										}
										catch(err) {
											if (err.code === 'NUMERIC_FAULT') {
												toast(tokenValueTooSmall)
											}
										}
									}
								}
							}}/>
						<InputRightAddon
							width='auto'
							borderTopLeftRadius='0.375rem'
							borderBottomLeftRadius='0.375rem'
							paddingInlineStart='0.5rem'
							paddingInlineEnd='0.5rem'
						>
							<Flex
								cursor='default'
								zIndex='1'
							>
								<Box d='flex' alignItems='center'>
									<Image
										width='24px'
										height='24px'
										mr='10px'
										src={token0.logoURI}
									/>
									<Box
										as='h3'
										m='0'
										fontSize='1.02rem'
										fontWeight='bold'
										textTransform='capitalize'>{token0.symbol}</Box>
								</Box>
							</Flex>
						</InputRightAddon>
					</InputGroup>
				</Flex>
				<Flex
					mt='.6rem'
					justifyContent='flex-end'
					flexDir='row'
				>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={() => {
							setInputAmount(
								ethers.utils.formatUnits(
									props.balance.div(100).mul(25),
									token0.decimals),
							)
							setValue(props.balance.div(100).mul(25))
						}}>
							25%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={() => {
							setInputAmount(
								ethers.utils.formatUnits(
									props.balance.div(100).mul(50),
									token0.decimals),
							)
							setValue(props.balance.div(100).mul(50))
						}}>
							50%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={() => {
							setInputAmount(
								ethers.utils.formatUnits(
									props.balance.div(100).mul(75),
									token0.decimals),
							)
							setValue(props.balance.div(100).mul(75))
						}}>
							75%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={() => {
							setInputAmount(
								ethers.utils.formatUnits(props.balance, token0.decimals),
							)
							setValue(props.balance)
						}}>
							MAX
					</Button>
				</Flex>
				<Checkbox
					colorScheme='pink'
					size='lg'
					mt='0.7rem'
				>
				Deposit LP tokens instead
				</Checkbox>
				<Flex mt='5.05rem' justifyContent='center'>
					<Button
						size='lg'
						w='100%'
						variant='solidRounded'
						disabled={working}
						onClick={() => console.log('hit')}
					>
						<Text fontWeight="bold">
							{wallet.account &&
								<>
									{!working &&
										<>
											{token0 && !token0Approved &&
												<>
													Approve {token0.symbol}
												</>
											}
											{token0 && token0Approved &&
												<>
													Bond
												</>
											}
										</>
									}
									{working &&
										<>
											<Spinner />
										</>
									}
								</>
							}
							{!wallet.account &&
								<>
									Bond
								</>
							}
						</Text>
					</Button>
				</Flex>
			</Flex>
		</>
	)
}

export default Bond