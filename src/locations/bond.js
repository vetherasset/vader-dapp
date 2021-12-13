/* eslint-disable no-undef */
import React, { useEffect, useMemo, useState } from 'react'
import { useLocalStorage, useSessionStorage } from 'react-use'
import { ethers } from 'ethers'
import { useWallet } from 'use-wallet'
import { Redirect, Link, useParams } from 'react-router-dom'
import { Box, Button, Flex, Text, InputGroup, Input, InputRightAddon, Image, Spinner,
	useToast, Container, Tag, TagLabel, Badge, Tabs, TabList, Tab, Switch, Link as LinkExt } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { bondConcluded, tokenValueTooSmall } from '../messages'
import { getERC20BalanceOf, getERC20Allowance, approveERC20ToSpend, bondDeposit } from '../common/ethereum'
import { prettifyCurrency } from '../common/utils'
import { useBondPrice } from '../hooks/useBondPrice'
import defaults from '../common/defaults'
import { useUniswapV2Price } from '../hooks/useUniswapV2Price'
import { TokenJazzicon } from '../components/TokenJazzicon'
import { walletNotConnected, noToken0, approved, rejected, exception,
	insufficientBalance, failed, noAmount } from '../messages'

const Bond = (props) => {

	const wallet = useWallet()
	const { address } = useParams()
	const toast = useToast()
	const [bond, setBond] = useState([])
	const [tabIndex, setTabIndex] = useState(0)
	const [token0, setToken0] = useState({})
	const [token0Approved, setToken0Approved] = useState(false)
	const [token0balance, setToken0balance] = useState(ethers.BigNumber.from(0))
	const [inputAmount, setInputAmount] = useState('')
	const [value, setValue] = useState(0)
	const [bondPrice, refetchBondPrice] = useBondPrice()
	const [slippageTolAmount, setSlippageTolAmount] = useLocalStorage('bondSlippageTolAmount394610', '')
	const [slippageTol, setSlippageTol] = useLocalStorage('bondSlippageTol394610', 2)
	const [useLPTokens, setUseLPTokens] = useSessionStorage('bondUseLPTokens', false)
	const [working, setWorking] = useState(false)

	const isBondAddress = useMemo(() => {
		if(ethers.utils.isAddress(address)) {
			if ((defaults.bonds?.filter((b) => {
				if(b.address === address) {
					return b.address === address
				}
			})).length > 0) {
				return true
			}
		}
	}, [address])

	const submit = () => {
		if(!working) {
			if(!wallet.account) {
				toast(walletNotConnected)
			}
			else if (tabIndex === 0) {
				if (!token0) {
					toast(noToken0)
				}
				else if (token0 && !token0Approved) {
					const provider = new ethers.providers.Web3Provider(wallet.ethereum)
					setWorking(true)
					approveERC20ToSpend(
						token0.address,
						bond?.[0]?.address,
						defaults.network.erc20.maxApproval,
						provider,
					).then((tx) => {
						tx.wait(defaults.network.tx.confirmations)
							.then(() => {
								setWorking(false)
								setToken0Approved(true)
								toast(approved)
							})
							.catch(e => {
								setWorking(false)
								if (e.code === 4001) toast(rejected)
								if (e.code === -32016) toast(exception)
							})
					})
						.catch(err => {
							setWorking(false)
							if(err.code === 'INSUFFICIENT_FUNDS') {
								console.log('Insufficient balance: Your account balance is insufficient.')
								toast(insufficientBalance)
							}
							else if(err.code === 4001) {
								console.log('Transaction rejected: Your have decided to reject the transaction..')
								toast(rejected)
							}
							else {
								console.log(err)
								toast(failed)
							}
						})
				}
				else if ((value > 0)) {
					if ((token0balance.gte(value))) {
						if (!token0.isEther) {
							const provider = new ethers.providers.Web3Provider(wallet.ethereum)
							setWorking(true)
							const p = !(Number(bondPrice?.bondPriceChangedEvents?.[0]?.internalPrice)) ? ethers.BigNumber.from(0) :
								Number(bondPrice?.bondPriceChangedEvents?.[0]?.internalPrice)
							const maxPrice = ethers.BigNumber.from(
								p,
							)
								.div(100)
								.mul(slippageTol)
								.div(ethers.utils.parseUnits('1', 18))
								.add(ethers.BigNumber.from(
									p,
								))
							bondDeposit(
								value,
								maxPrice,
								wallet.account,
								bond?.[0]?.address,
								provider)
								.then((tx) => {
									tx.wait(
										defaults.network.tx.confirmations,
									).then((r) => {
										setWorking(false)
										refetchBondPrice()
										toast({
											...bondConcluded,
											description: <LinkExt
												variant='underline'
												_focus={{
													boxShadow: '0',
												}}
												href={`${defaults.api.etherscanUrl}/tx/${r.transactionHash}`}
												isExternal>
												<Box>Click here to view transaction on <i><b>Etherscan</b></i>.</Box></LinkExt>,
											duration: defaults.toast.txHashDuration,
										})
									})
								})
								.catch(err => {
									setWorking(false)
									if (err.code === 4001) {
										console.log('Transaction rejected: Your have decided to reject the transaction..')
										toast(rejected)
									}
									else if(err.code === -32016) {
										toast(exception)
									}
									else {
										console.log(err)
										toast(failed)
									}
								})
						}
						else {
							// is Native
						}
					}
					else {
						toast(insufficientBalance)
					}
				}
				else {
					toast(noAmount)
				}
			}
			else {
				console.log('claim')
			}
		}
	}

	useEffect(() => {
		if(isBondAddress) {
			setBond(defaults.bonds?.filter((b) => {
				return b.address === address
			}))
		}
	}, [address])

	useEffect(() => {
		if(useLPTokens) {
			setToken0(bond?.[0]?.principal)
		}
		return () => setToken0(defaults.ether)
	}, [useLPTokens, bond])

	useEffect(() => {
		if (wallet.account && token0) {
			if (!token0?.isEther) {
				setWorking(true)
				const provider = new ethers.providers.Web3Provider(wallet.ethereum)
				getERC20Allowance(
					token0.address,
					wallet.account,
					bond?.[0]?.address,
					provider,
				).then((n) => {
					setWorking(false)
					if(n.gt(0))	setToken0Approved(true)
				})
					.catch((err) => {
						setWorking(false)
						console.log(err)
					})
			}
			else {
				setToken0Approved(true)
			}
		}
		return () => {
			setWorking(false)
			setToken0Approved(false)
		}
	}, [wallet.account, bond, token0])

	useEffect(() => {
		if (wallet.account && token0?.address) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			if (!token0.isEther) {
				getERC20BalanceOf(
					token0?.address,
					wallet?.account,
					provider,
				)
					.then(n => {
						setToken0balance(n)
					})
					.catch((err) => {
						console.log(err)
					})
			}
			else {
				provider.getSigner().getBalance()
					.then((n) => setToken0balance(n))
			}
		}
	}, [wallet.account, token0])

	if (isBondAddress) {
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
						 minH='96.3667px'
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
							{bond?.[0]?.name &&
								<>
									{bond?.[0]?.name}
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
							height='100%'
							flexWrap={{ base: 'wrap', md: 'nowrap' }}
						>
							<Flex
								flexDir='column'
								height='100%'
								width={{ base: '100%', md: '50%' }}
							>
								<Flex
									p={{ base: '1.8rem', md: '1.8rem 0.9rem 1.8rem 1.8rem' }}
									minH='526.4px'
									justifyContent='space-between'
									gridGap='5px'
									flexDir='column'>
									<Tabs
										index={tabIndex}
										onChange={setTabIndex}
										width='100%'
										isFitted colorScheme='bluish'>
										<TabList mb='1rem'>
											<Tab
												p='0 0 1.5rem 0'
												_active={{
													background: 'transparent',
												}}
												_focus={{
													boxShadow: 'none',
												}}>
												<Text as='h3' m='0' fontSize='1.24rem'>
												Bond
												</Text>
											</Tab>
											<Tab
												p='0 0 1.5rem 0'
												_active={{
													background: 'transparent',
												}}
												_focus={{
													boxShadow: 'none',
												}}>
												<Text as='h3' m='0' fontSize='1.24rem'>
												Claim
												</Text>
											</Tab>
										</TabList>
									</Tabs>

									<Flex
										flexDir='column'
									>
										<Flex
											alignItems='center'
											justifyContent='space-between'>
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
															if(Number(e.target.value) >= 0) {
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
															{token0 && token0?.logoURI &&
																<Image
																	width='24px'
																	height='24px'
																	borderRadius='50%'
																	mr='5px'
																	src={token0?.logoURI}
																/>
															}
															{token0?.address && !token0?.logoURI &&
																<TokenJazzicon address={token0.address} />
															}
															<Box
																as='h3'
																m='0'
																fontSize='1.02rem'
																fontWeight='bold'
																textTransform='capitalize'>{token0?.symbol}</Box>
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
															token0balance.div(100).mul(25),
															token0.decimals),
													)
													setValue(token0balance.div(100).mul(25))
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
															token0balance.div(100).mul(50),
															token0.decimals),
													)
													setValue(token0balance.div(100).mul(50))
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
															token0balance.div(100).mul(75),
															token0.decimals),
													)
													setValue(token0balance.div(100).mul(75))
												}}>
											75%
											</Button>
											<Button
												variant='outline'
												size='sm'
												mr='0.4rem'
												onClick={() => {
													setInputAmount(
														ethers.utils.formatUnits(token0balance, token0.decimals),
													)
													setValue(token0balance)
												}}>
											MAX
											</Button>
										</Flex>
									</Flex>

									<Flex
										flexDir='column'
									>
										<Text
											as='h4'
											fontWeight='bolder'>
											Slippage Tolerance
										</Text>
										<Flex
											mt='.6rem'
											justifyContent='flex-start'
											flexDir='row'
										>
											<Button
												variant='outline'
												size='sm'
												mr='0.4rem'
												style={{
													border: slippageTol === 2 && !slippageTolAmount ? '2px solid #3fa3fa' : '',
												}}
												onClick={() => {
													setSlippageTolAmount('')
													setSlippageTol(2)
												}}>
											2%
											</Button>
											<Button
												variant='outline'
												size='sm'
												mr='0.4rem'
												style={{
													border: slippageTol === 3 && !slippageTolAmount ? '2px solid #3fa3fa' : '',
												}}
												onClick={() => {
													setSlippageTolAmount('')
													setSlippageTol(3)
												}}>
											3%
											</Button>
											<Button
												variant='outline'
												size='sm'
												mr='0.4rem'
												style={{
													border: slippageTol === 5 && !slippageTolAmount ? '2px solid #3fa3fa' : '',
												}}
												onClick={() => {
													setSlippageTolAmount('')
													setSlippageTol(5)
												}}>
											5%
											</Button>
											<Input
												size='sm'
												variant='outline'
												placeholder='Custom %'
												style={{
													border: (([2, 3, 5].indexOf(slippageTol) === -1) || slippageTolAmount) ? '2px solid #3fa3fa' : '',
												}}
												value={slippageTolAmount}
												onChange={(e) => {
													if (isNaN(e.target.value)) {
														setSlippageTolAmount(prev => prev)
													}
													else {
														setSlippageTolAmount(String(e.target.value))
														if(Number(e.target.value) >= 0) {
															try {
																setSlippageTol(ethers.utils.parseUnits(String(e.target.value), token0.decimals))
															}
															catch(err) {
																if (err.code === 'NUMERIC_FAULT') {
																	console.log('value too small')
																}
															}
														}
													}
												}}
											/>
										</Flex>
									</Flex>

									<Flex
										borderTop='1px solid rgb(102, 101, 129)'
										pt='2.1rem'
										w='100%'
										flexDir='row'
										justifyContent='space-between'
									>
										<Box
											as='h4'
											fontWeight='bolder'
										>
											Use LP tokens instead
										</Box>
										<Switch
											size='lg'
											isChecked={useLPTokens}
											onChange={() => setUseLPTokens(!useLPTokens)}/>
									</Flex>
								</Flex>
							</Flex>

							<Flex
								flexDir='column'
								height='100%'
								width={{ base: '100%', md: '50%' }}
							>
								<Flex
									p={{ base: '1.8rem', md: '1.8rem 1.8rem 1.8rem 0.9rem' }}
									minH='526.4px'
									justifyContent='space-between'
									gridGap='12px'
									flexDir='column'>

									<PriceOverview />

									<Breakdown/>

									<Flex
										m='1.66rem 0'
										fontSize={{ base: '1.35rem', md: '1.5rem' }}
										fontWeight='bolder'
										justifyContent='center' alignItems='center' flexDir='column'
									>
										{prettifyCurrency(
											858588,
											0,
											5,
											'VADER',
										)}
										<Box
											as='h3'
											fontWeight='bold'
											textAlign='center'
											fontSize='1rem'
										>
											<Badge
												as='div'
												fontSize={{ base: '0.6rem', md: '0.75rem' }}
												background='rgb(214, 188, 250)'
												color='rgb(128, 41, 251)'
											>Claimable Now
											</Badge>
										</Box>
									</Flex>

									<Flex justifyContent='center'>
										<Button
											size='lg'
											w='100%'
											variant='solidRounded'
											disabled={working}
											onClick={() => submit()}
										>
											<Text fontWeight="bold">
												{wallet.account &&
													<>
														{!working &&
															<>
																{tabIndex === 0 &&
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
																{tabIndex === 1 &&
																	<>
																		Claim
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
														{tabIndex === 0 &&
															<>
																Bond
															</>
														}
														{tabIndex === 1 &&
															<>
																Claim
															</>
														}
													</>
												}
											</Text>
										</Button>
									</Flex>
								</Flex>
							</Flex>
						</Flex>
					</Flex>
				</Box>
			</>
		)
	}
	return (
		<Redirect to={'/bond'} />
	)
}

const PriceOverview = () => {

	const [bondPrice] = useBondPrice()
	const [usdcEth] = useUniswapV2Price(defaults.address.uniswapV2.usdcEthPair)
	const [vaderEth] = useUniswapV2Price(defaults.address.uniswapV2.vaderEthPair)
	const [principalEth] = useUniswapV2Price(defaults.address.uniswapV2.vaderEthPair, true)

	return (
		<Flex>
			<Container p='0 6px 6px 2px'>
				<Box textAlign={{ base: 'center', md: 'left' }}>
					<Tag
						width='100%'
						minH='95.5167px'
						flexDir='column'
						size='lg'
						variant='outline'
						p='18px 0'
					>
						<Box fontSize='1rem'>Bond Price</Box>
						<TagLabel fontSize='2.1rem'>
							{principalEth &&
								<>
									{prettifyCurrency(
										Number(ethers.utils.formatUnits(bondPrice?.bondPriceChangedEvents?.[0]?.internalPrice, 18)) *
										(Number(usdcEth?.pairs?.[0]?.token0Price) * Number(principalEth?.principalPrice)),
										0, 5)}
								</>
							}
						</TagLabel>
					</Tag>
				</Box>
			</Container>

			<Container p='0 2px 6px 6px'>
				<Box textAlign={{ base: 'center', md: 'left' }}>
					<Tag
						width='100%'
						minH='95.5167px'
						flexDir='column'
						size='lg'
						variant='outline'
						p='18px 0'
					>
						<Box fontSize='1rem'>Market Price</Box>
						<TagLabel fontSize='2.1rem'>
							{!isNaN(Number(usdcEth?.pairs?.[0]?.token0Price) * Number(vaderEth?.pairs?.[0]?.token1Price)) &&
								<>
									{prettifyCurrency(
										(Number(usdcEth?.pairs?.[0]?.token0Price) * Number(vaderEth?.pairs?.[0]?.token1Price)),
										0,
										5,
									)}
								</>
							}
						</TagLabel>
					</Tag>
				</Box>
			</Container>
		</Flex>
	)
}

// const Overview = () => {

// 	return (
// 		<>
// 			<Flex
// 				flexDir='column'
// 				p='0 0.15rem'
// 				marginBottom='.7rem'
// 				opacity='0.87'
// 			>
// 				<Flex>
// 					<Container p='0'>
// 						<Box
// 							textAlign='left'
// 						>
// 							Total rewards
// 						</Box>
// 					</Container>
// 					<Container p='0'>
// 						<Box
// 							textAlign='right'
// 						>
// 							999999
// 						</Box>
// 					</Container>
// 				</Flex>

// 				<Flex>
// 					<Container p='0'>
// 						<Box
// 							textAlign='left'
// 						>
// 							Claimed
// 						</Box>
// 					</Container>
// 					<Container p='0'>
// 						<Box
// 							textAlign='right'
// 						>
// 							222
// 						</Box>
// 					</Container>
// 				</Flex>

// 				<Flex>
// 					<Container p='0'>
// 						<Box
// 							textAlign='left'>
// 							Remains vested
// 						</Box>
// 					</Container>
// 					<Container p='0'>
// 						<Box
// 							textAlign='right'>
// 							222
// 						</Box>
// 					</Container>
// 				</Flex>

// 				<Flex>
// 					<Container p='0'>
// 						<Box
// 							textAlign='left'>
// 							Vesting Term
// 						</Box>
// 					</Container>
// 					<Container p='0'>
// 						<Box
// 							textAlign='right'>
// 							4
// 						</Box>
// 					</Container>
// 				</Flex>
// 			</Flex>
// 		</>
// 	)
// }

const Breakdown = () => {

	return (
		<>
			<Flex
				flexDir='column'
				p='0 0.15rem'
				marginBottom='.7rem'
				opacity='0.87'
			>
				<Text
					as='h4'
					fontSize='1.24rem'
					fontWeight='bolder'>
					Breakdown
				</Text>
				<Flex>
					<Container p='0'>
						<Box
							textAlign='left'
						>
							What you get
						</Box>
					</Container>
					<Container p='0'>
						<Box
							textAlign='right'
						>
							999999
						</Box>
					</Container>
				</Flex>

				<Flex>
					<Container p='0'>
						<Box
							textAlign='left'
						>
							ROI
						</Box>
					</Container>
					<Container p='0'>
						<Box
							textAlign='right'
						>
							222
						</Box>
					</Container>
				</Flex>

				<Flex>
					<Container p='0'>
						<Box
							textAlign='left'>
							Vesting Term
						</Box>
					</Container>
					<Container p='0'>
						<Box
							textAlign='right'>
							3
						</Box>
					</Container>
				</Flex>
			</Flex>
		</>
	)
}

export default Bond