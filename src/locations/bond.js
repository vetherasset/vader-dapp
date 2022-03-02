import React, { useEffect, useMemo, useState } from 'react'
import { renderToString } from 'react-dom/server'
import PropTypes from 'prop-types'
import { useLocalStorage, useSessionStorage } from 'react-use'
import { ethers, utils } from 'ethers'
import { useWallet } from 'use-wallet'
import { Redirect, Link, useParams } from 'react-router-dom'
import { Box, Button, Flex, Text, InputGroup, Input, InputRightAddon, Image, Spinner,
	useToast, Container, Tag, TagLeftIcon, TagLabel, Badge, Tabs, TabList, Tab, Switch, Link as LinkExt, InputRightElement,
	FormControl, FormLabel, useBreakpointValue, HStack, useRadioGroup, useRadio, Select } from '@chakra-ui/react'
import { ArrowBackIcon, CheckCircleIcon } from '@chakra-ui/icons'
import { getERC20BalanceOf, getERC20Allowance, approveERC20ToSpend, bondDeposit, bondPayoutFor, bondRedeem, zapDeposit, preCommitZap,
	unCommit } from '../common/ethereum'
import { prettifyCurrency, prettifyNumber, calculateDifference, getPercentage, getDateFromTimestamp, prettifyAddress } from '../common/utils'
import { useBondPrice } from '../hooks/useBondPrice'
import { useERC20Balance } from '../hooks/useERC20Balance'
import defaults from '../common/defaults'
import { useUniswapV2Price } from '../hooks/useUniswapV2Price'
import { TokenJazzicon } from '../components/TokenJazzicon'
import { walletNotConnected, noToken0, approved, rejected, exception,
	insufficientBalance, failed, noAmount, bondPurchaseValueExceeds, bondSoldOut, nothingtoclaim,
	bondConcluded, tokenValueTooSmall, vaderclaimed, bondAmountTooSmall, precommitCapHit, commitAmountTooSmall, commitAmounTooLarge, commitConcluded, commitWithdrawn, noCommitSelected, nothingtoUncommit } from '../messages'
import { useBondTerms } from '../hooks/useBondTerms'
import { useTreasuryBalance } from '../hooks/useTreasuryBalance'
import { useBondPendingPayout } from '../hooks/useBondPendingPayout'
import { useBondInfo } from '../hooks/useBondInfo'
import { useBondMaxPayout } from '../hooks/useBondMaxPayout'
import { usePreCommit } from '../hooks/usePreCommit'
import { useAccountPreCommits } from '../hooks/useAccountPreCommits'
import TimeAgo from 'react-timeago'

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
	const [value, setValue] = useState(ethers.BigNumber.from(0))
	const [principalEth] = useUniswapV2Price(bond?.[0]?.principal?.address, true)
	const [purchaseValue, setPurchaseValue] = useState(ethers.BigNumber.from(0))
	const { data: treasuryBalance, refetch: refetchTreasuryBalance } = useTreasuryBalance(bond?.[0]?.address, true)
	const { data: bondPrice, refetch: refetchBondPrice } = useBondPrice(bond?.[0]?.address)
	const [slippageTolAmount0, setSlippageTolAmount0] = useSessionStorage('bondSlippageTolAmount042334310', '')
	const [slippageTol0, setSlippageTol0] = useSessionStorage('bondSlippageTol042434310', 6)
	const [slippageTolAmount1, setSlippageTolAmount1] = useSessionStorage('bondSlippageTol1Amount142344310', '')
	const [slippageTol1, setSlippageTol1] = useSessionStorage('bondSlippageTol142434310', 2)
	const [useLPTokens, setUseLPTokens] = useSessionStorage('bondUseLPTokens', false)
	const [working, setWorking] = useState(false)
	const { data: bondInfo, refetch: refetchBondInfo } = useBondInfo(bond?.[0]?.address, wallet.account, true)
	const [pendingPayout, setPendingPayoutBlock] = useBondPendingPayout(bond?.[0]?.address)
	const { data: maxPayout, refetch: refetchMaxPayout } = useBondMaxPayout(bond?.[0]?.address)
	const preCommit = usePreCommit(bond?.[0]?.precommit)
	const [preCommitOption, setPrecommitOption] = useLocalStorage('preCommitOption23049', true)
	const [commitIndex, setCommitIndex] = useState('')
	const preCommits = useAccountPreCommits(wallet?.account?.toLowerCase())

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
				if (!preCommit.open.data &&
					treasuryBalance &&
					treasuryBalance.lte(defaults.bondConsideredSoldOutMinVader)) {
					toast(bondSoldOut)
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
				else if (
					(value > 0 && preCommit.open.data && preCommitOption) ||
					(value > 0 && !preCommit.open.data)) {
					if ((token0balance.gte(value))) {
						if (!preCommit.open.data) {
							if (!token0.isEther) {
								const maxAvailable = ((treasuryBalance)
									.lte(maxPayout)) ?
									(treasuryBalance) :
									maxPayout
								if (purchaseValue.lte(maxAvailable)) {
									const provider = new ethers.providers.Web3Provider(wallet.ethereum)
									setWorking(true)
									const p = !(Number(bondPrice)) ? ethers.BigNumber.from(0) :
										bondPrice
									const maxPrice = ethers.BigNumber.from(
										p,
									)
										.div(100)
										.mul(slippageTol1)
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
												refetchMaxPayout()
												refetchBondInfo()
												refetchTreasuryBalance()
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
									toast(bondPurchaseValueExceeds)
								}
							}
							else {
								const maxAvailable = ((treasuryBalance)
									.lte(maxPayout)) ?
									(treasuryBalance) :
									maxPayout
								if (purchaseValue.lte(maxAvailable)) {
									const p = !(Number(purchaseValue)) ? ethers.BigNumber.from(0) :
										purchaseValue
									const minPayout =
								p
									.div(100)
									.mul(slippageTol0)
									.sub(p)
									.mul(-1)
									if (minPayout?.gt(ethers.BigNumber.from(String(defaults.bondZapMinPayoutAllowed), defaults.vader.decimals))) {
										const provider = new ethers.providers.Web3Provider(wallet.ethereum)
										setWorking(true)
										zapDeposit(
											bond?.[0]?.zap,
											value,
											minPayout,
											provider)
											.then((tx) => {
												tx.wait(
													defaults.network.tx.confirmations,
												).then((r) => {
													setWorking(false)
													refetchBondPrice()
													refetchMaxPayout()
													refetchBondInfo()
													refetchTreasuryBalance()
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
										toast(bondAmountTooSmall)
									}
								}
								else {
									toast(bondPurchaseValueExceeds)
								}
							}
						}
						else if (preCommit.open.data &&
							preCommitOption) {
							if (preCommit?.count?.data?.lt(preCommit?.maxCommits?.data)) {
								if (value?.gte(preCommit?.minAmountIn?.data)) {
									if (value?.lte(preCommit?.maxAmountIn?.data)) {
										const provider = new ethers.providers.Web3Provider(wallet.ethereum)
										setWorking(true)
										preCommitZap(
											value,
											bond?.[0]?.precommitzap,
											provider)
											.then((tx) => {
												tx.wait(
													defaults.network.tx.confirmations,
												).then((r) => {
													setWorking(false)
													preCommit.count.refetch()
													preCommit.open.refetch()
													preCommits.refetch()
													refetchBondPrice()
													refetchMaxPayout()
													refetchBondInfo()
													refetchTreasuryBalance()
													toast({
														...commitConcluded,
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
										toast(commitAmounTooLarge)
									}
								}
								else {
									toast(commitAmountTooSmall)
								}
							}
							else {
								toast(precommitCapHit)
							}
						}
					}
					else {
						toast(insufficientBalance)
					}
				}
				else if (preCommit.open.data &&
					!preCommitOption) {
					const availableCommits = preCommits?.data?.accounts?.[0]?.commit?.filter((commit) => {
						return commit?.isRemoved === false
					})
					if (availableCommits.length > 0) {
						if (commitIndex) {
							const provider = new ethers.providers.Web3Provider(wallet.ethereum)
							setWorking(true)
							unCommit(
								commitIndex,
								bond?.[0]?.precommit,
								provider)
								.then((tx) => {
									tx.wait(
										defaults.network.tx.confirmations,
									).then((r) => {
										setWorking(false)
										preCommit.count.refetch()
										preCommit.open.refetch()
										preCommits.refetch()
										refetchBondPrice()
										refetchMaxPayout()
										refetchBondInfo()
										refetchTreasuryBalance()
										toast({
											...commitWithdrawn,
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
							toast(noCommitSelected)
						}
					}
					else {
						toast(nothingtoUncommit)
					}
				}
				else {
					toast(noAmount)
				}
			}
			else if (pendingPayout) {
				if (ethers.BigNumber.from(pendingPayout).gt(0)) {
					setWorking(true)
					const provider = new ethers.providers.Web3Provider(wallet.ethereum)
					bondRedeem(
						bond?.[0]?.address,
						wallet.account,
						provider)
						.then((tx) => {
							tx.wait(
								defaults.network.tx.confirmations,
							).then(() => {
								setWorking(false)
								refetchBondInfo()
								setPendingPayoutBlock(0)
								toast(vaderclaimed)
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
					toast(nothingtoclaim)
				}
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
		if (bond?.[0]?.principal) {
			if(useLPTokens) {
				setToken0(bond?.[0]?.principal)
			}
		}
		return () => setToken0(defaults.ether)
	}, [useLPTokens, bond])

	useEffect(() => {
		if (wallet.account && token0) {
			if (!token0.isEther && bond?.[0]?.address && token0.address) {
				setWorking(true)
				getERC20Allowance(
					token0.address,
					wallet.account,
					bond?.[0]?.address,
					defaults.network.provider,
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
		if (wallet.account && token0) {
			if (!token0.isEther && token0.address) {
				getERC20BalanceOf(
					token0?.address,
					wallet?.account,
					defaults.network.provider,
				)
					.then(n => {
						setToken0balance(n)
					})
					.catch((err) => {
						console.log(err)
					})
			}
			else {
				const provider = new ethers.providers.Web3Provider(wallet.ethereum)
				provider.getSigner().getBalance()
					.then(
						(n) => setToken0balance(n))
			}
		}
	}, [wallet.account, token0])

	useEffect(() => {
		if (value > 0) {
			if (useLPTokens || principalEth?.principalPrice) {
				bondPayoutFor(
					bond?.[0]?.address,
					useLPTokens ? value :
						ethers.utils.parseUnits(
							(Number(inputAmount) / Number(principalEth?.principalPrice)).toFixed(bond?.[0].principal?.decimals), bond?.[0].principal?.decimals,
						)
					,
				)
					.then(n => {
						setPurchaseValue(n)
					})
			}
			else {
				setPurchaseValue(ethers.BigNumber.from(0))
			}
		}
	}, [value, useLPTokens, principalEth?.principalPrice])

	if (isBondAddress) {
		return (
			<>
				<Box
					maxWidth={defaults.layout.container.md.width}
					m='0 auto'
					p={{ base: '3rem .4rem 0', md: '5rem 0 0' }}
					{...props}
				>
			 <Flex
						minH='96.3667px'
						m='0 auto'
						p={{ base: '1.8rem 0', md: '1.8rem' }}
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
								aria-label="Back to bond"
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
							mr={{ base: '0', md: '10.66px' }}
							fontWeight='bolder'>
							{bond?.[0]?.name &&
								<>
									{bond?.[0]?.name}
								</>
							}
						</Text>
						<Box
							width='22px'
						>
							{/* empty :-) */}
						</Box>
					</Flex>
					<Flex
						m='0 auto'
						flexDir='column'
						layerStyle='colorful'
						minH='565.25px'
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
									p={{ base: '1.8rem 0.6rem', md: '1.8rem 0.9rem 1.8rem 1.8rem' }}
									minH={{ base: '', md: '564.28px' }}
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
													{!preCommit.open.data ? 'Bond' : 'Pre-commit'}
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
										pointerEvents={{ base: '', md: `${tabIndex === 1 ? 'none' : ''}` }}
										opacity={{ base: '1', md: `${tabIndex === 1 ? '0.55' : '1'}` }}
										flexDir='column'
									>
										{useBreakpointValue({
											base: <PriceOverview
												bond={bond}
											/>,
											md:	'',
										})}

										{useBreakpointValue({
											base: <>
												{tabIndex === 0 &&
														<Breakdown
															value={inputAmount}
															useLPTokens={useLPTokens}
															treasuryBalance={treasuryBalance}
															maxPayout={maxPayout}
															bond={bond}
														/>
												}
												{tabIndex === 1 &&
														<Overview
															bondInfo={bondInfo}
															pendingPayout={pendingPayout}
														/>
												}
											</>,
											md:	'',
										})}

										{(preCommitOption !== false || !preCommit.open.data) &&
											<Flex
												display={{ base: `${tabIndex === 1 ? 'none' : ''}`, md: 'flex' }}
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
																			alt={`${token0?.name} token`}
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
										}
										{preCommit.open.data &&
											!preCommitOption &&
											<PreCommitsSelect
												setCommitIndex={setCommitIndex}/>
										}
									</Flex>

									{preCommit.open.data &&
										<PreCommitOptions
											pointerEvents={tabIndex === 1 ? 'none' :
												''}
											opacity={
												tabIndex === 1 ? '0.5' :
													'1'
											}
											set={setPrecommitOption}
											setting={preCommitOption}
										/>
									}

									{!preCommit.open.data &&
										<Flex
											display={{ base: `${tabIndex === 1 ? 'none' : ''}`, md: 'flex' }}
											mt={{ base: '1.2rem', md: '' }}
											flexDir='column'
										>
											<Flex
												pointerEvents={tabIndex === 1 ? 'none' : ''}
												opacity={tabIndex === 1 ? '0.55' : '1'}
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
															border: useLPTokens && slippageTol1 === 2 && !slippageTolAmount1 ? '2px solid #3fa3fa' :
																!useLPTokens && slippageTol0 === 4 && !slippageTolAmount0 ? '2px solid #3fa3fa' : '',
														}}
														onClick={() => {
															if (useLPTokens) { setSlippageTol1(2), setSlippageTolAmount1('') }
															if (!useLPTokens) { setSlippageTol0(4), setSlippageTolAmount0('') }
														}}>
														{useLPTokens &&
														<>
															2%
														</>
														}
														{!useLPTokens &&
														<>
															4%
														</>
														}
													</Button>
													<Button
														variant='outline'
														size='sm'
														mr='0.4rem'
														style={{
															border: useLPTokens && slippageTol1 === 3 && !slippageTolAmount1 ? '2px solid #3fa3fa' :
																!useLPTokens && slippageTol0 === 6 && !slippageTolAmount0 ? '2px solid #3fa3fa' : '',
														}}
														onClick={() => {
															if (useLPTokens) { setSlippageTol1(3), setSlippageTolAmount1('') }
															if (!useLPTokens) { setSlippageTol0(6), setSlippageTolAmount0('') }
														}}>
														{useLPTokens &&
														<>
															3%
														</>
														}
														{!useLPTokens &&
														<>
															6%
														</>
														}
													</Button>
													<Button
														variant='outline'
														size='sm'
														mr='0.4rem'
														style={{
															border: useLPTokens && slippageTol1 === 5 && !slippageTolAmount1 ? '2px solid #3fa3fa' :
																!useLPTokens && slippageTol0 === 8 && !slippageTolAmount0 ? '2px solid #3fa3fa' : '',
														}}
														onClick={() => {
															if (useLPTokens) { setSlippageTol1(5), setSlippageTolAmount1('') }
															if (!useLPTokens) { setSlippageTol0(8), setSlippageTolAmount0('') }
														}}>
														{useLPTokens &&
														<>
															5%
														</>
														}
														{!useLPTokens &&
														<>
															8%
														</>
														}
													</Button>
													<InputGroup
														size='sm'
													>
														<Input
															variant='outline'
															placeholder='Custom'
															style={{
																border: useLPTokens && ((([2, 3, 5].indexOf(slippageTol1) === -1)) || slippageTolAmount1) ? '2px solid #3fa3fa' :
																	!useLPTokens && ((([4, 6, 8].indexOf(slippageTol0) === -1)) || slippageTolAmount0) ? '2px solid #3fa3fa' : '',
															}}
															value={useLPTokens ? slippageTolAmount1 : slippageTolAmount0}
															onChange={(e) => {
																if (isNaN(e.target.value)) {
																	if (useLPTokens) setSlippageTolAmount1(prev => prev)
																	if (!useLPTokens) setSlippageTolAmount0(prev => prev)
																}
																else {
																	if (useLPTokens) setSlippageTolAmount1(String(e.target.value))
																	if (!useLPTokens) setSlippageTolAmount0(String(e.target.value))
																	if(Number(e.target.value) >= 0) {
																		try {
																			if (useLPTokens) setSlippageTol1(ethers.utils.parseUnits(String(e.target.value), token0.decimals))
																			if (!useLPTokens) setSlippageTol0(ethers.utils.parseUnits(String(e.target.value), token0.decimals))
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
														<InputRightElement>
															<>
															%
															</>
														</InputRightElement>
													</InputGroup>
												</Flex>
											</Flex>

											{bond?.[0]?.principal &&
												<FormControl
													d='flex'
													pointerEvents={tabIndex === 1 ? 'none' : ''}
													opacity={tabIndex === 1 ? '0.55' : '1'}
													mt={{ base: '3.2rem', md: '' }}
													borderTop='1px solid rgb(102, 101, 129)'
													borderBottom={{ base: '1px solid rgb(102, 101, 129)', md: 'none' }}
													pt='2.1rem'
													pb={{ base: '2.1rem', md: '0' }}
													w='100%'
													flexDir='row'
													justifyContent='space-between'
												>
													<FormLabel
														htmlFor='useLPTokens'
														fontWeight='bolder'
													>
														Use LP tokens instead
													</FormLabel>
													<Switch
														id='useLPTokens'
														size='lg'
														isChecked={useLPTokens}
														onChange={() => setUseLPTokens(!useLPTokens)}/>
												</FormControl>
											}
										</Flex>
									}
								</Flex>
							</Flex>

							<Flex
								flexDir='column'
								height='100%'
								width={{ base: '100%', md: '50%' }}
							>
								<Flex
									p={{ base: '1.8rem 0.6rem', md: '1.8rem 1.8rem 1.8rem 0.9rem' }}
									minH={{ base: '', md: '564.283px' }}
									justifyContent='space-between'
									gridGap={'12px'}
									flexDir='column'>

									{useBreakpointValue({
										base:	'',
										md: <PriceOverview
											bond={bond}
										/>,
									})}

									{useBreakpointValue({
										base:	'',
										md: <>
											{tabIndex == 0 &&
													<Breakdown
														value={inputAmount}
														useLPTokens={useLPTokens}
														treasuryBalance={treasuryBalance}
														maxPayout={maxPayout}
														bond={bond}
													/>
											}
											{tabIndex === 1 &&
													<Overview
														bondInfo={bondInfo}
														pendingPayout={pendingPayout}
													/>
											}
										</>,
									})}

									{tabIndex == 0 &&
										<Flex
											minH='76px'
											m={ preCommit?.open?.data ? '1.06rem 0' : '1.66rem 0' }
											fontSize={{ base: '1.35rem', md: '1.5rem' }}
											fontWeight='bolder'
											justifyContent='center' alignItems='center' flexDir='column'
										>
											<Box
												minH={{ base: '32.4px', md: '36px' }}
											>
												{treasuryBalance && !preCommit?.open?.data &&
													<>
														{(treasuryBalance.gt(defaults.bondConsideredSoldOutMinVader)) &&
															<>
																{purchaseValue !== '' &&
																	prettifyCurrency(
																		purchaseValue !== '' ? ethers.utils.formatUnits(purchaseValue, 18) : 0,
																		0,
																		2,
																		'VADER')
																}
															</>
														}
														{(treasuryBalance.lte(defaults.bondConsideredSoldOutMinVader)) &&
															<>
																Sold Out
															</>
														}
													</>
												}
											</Box>

											<Box
												as='h3'
												fontWeight='bold'
												textAlign='center'
												fontSize='1rem'
											>
												{treasuryBalance && !preCommit?.open?.data &&
													<>
														{(treasuryBalance.gt(defaults.bondConsideredSoldOutMinVader)) &&
															<>
																<Badge
																	as='div'
																	fontSize={{ base: '0.6rem', md: '0.75rem' }}
																	background='rgb(214, 188, 250)'
																	color='rgb(128, 41, 251)'
																>PURCHASE VALUE
																</Badge>
															</>
														}
														{(treasuryBalance.lte(defaults.bondConsideredSoldOutMinVader)) &&
															<>
																<Badge
																	as='div'
																	fontSize={{ base: '0.6rem', md: '0.75rem' }}
																	background='rgb(214, 188, 250)'
																	color='rgb(128, 41, 251)'
																>NOT AVAILABLE
																</Badge>
															</>
														}
													</>
												}
											</Box>
										</Flex>
									}

									{tabIndex == 1 &&
										<Flex
											minH='76px'
											m={ !preCommit.open.data ? '1.66rem 0' : '2.59rem 0 1rem' }
											fontSize={{ base: '1.35rem', md: '1.5rem' }}
											fontWeight='bolder'
											justifyContent='center' alignItems='center' flexDir='column'
										>
											<Box
												minH={{ base: '32.4px', md: '36px' }}
											>
												{pendingPayout && pendingPayout.gte(0) &&
													prettifyCurrency(
														ethers.utils.formatUnits(pendingPayout, defaults.vader.decimals),
														0,
														5,
														'VADER')
												}
											</Box>

											<Box
												as='h3'
												fontWeight='bold'
												textAlign='center'
												fontSize='1rem'
											>
												{pendingPayout && pendingPayout.gte(0) &&
												<Badge
													as='div'
													fontSize={{ base: '0.6rem', md: '0.75rem' }}
													background='rgb(214, 188, 250)'
													color='rgb(128, 41, 251)'
												>CLAIMABLE NOW
												</Badge>
												}
											</Box>
										</Flex>
									}

									<Flex justifyContent='center'>
										<Button
											size='lg'
											w='100%'
											mb={{ base: '0.9rem', md: '0' }}
											variant='solidRounded'
											disabled={working}
											onClick={() => submit()}
										>
											<Text as='div' fontWeight="bold">
												{wallet.account &&
													<>
														{!working &&
															<>
																{!preCommit.open.data &&
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
																						Purchase
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
																{preCommit.open.data &&
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
																						{preCommitOption &&
																							<>
																								Deposit
																							</>
																						}
																						{!preCommitOption &&
																							<>
																								Withdraw
																							</>
																						}
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
																{!preCommit.open.data &&
																	<>
																		Purchase
																	</>
																}
																{preCommit.open.data &&
																	<>
																		{preCommitOption &&
																			<>
																				Deposit
																			</>
																		}
																		{!preCommitOption &&
																			<>
																				Withdraw
																			</>
																		}
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

const PreCommitsSelect = (props) => {

	PreCommitsSelect.propTypes = {
		setCommitIndex: PropTypes.func.isRequired,
	}

	const wallet = useWallet()
	const preCommits = useAccountPreCommits(wallet?.account?.toLowerCase())

	useEffect(() => {
		return () => props.setCommitIndex('')
	}, [])

	return (
		<Flex
			flexDir='column'
			pb='50px'
		>
			<Flex
				alignItems='center'
				justifyContent='space-between'>
				<Text
					as='h4'
					fontSize={{ base: '1rem', md: '1.24rem' }}
					fontWeight='bolder'>
						Commit
				</Text>
			</Flex>
			<Select
				variant='outline'
				size='lg'
				placeholder={preCommits?.data?.accounts?.[0]?.commit?.length > 0 ? 'Select commit to withdraw' : 'No commits'}
				onChange={(event) => {props.setCommitIndex(event.target.value)}}
			>
				{preCommits?.data?.accounts?.[0]?.commit?.filter((commit) => {
					return commit?.isRemoved === false
				}).sort((a, b) => {
					return b?.commitEvent?.timestamp - a?.commitEvent?.timestamp
				}).map((commit, index) => {
					const idIndex = commit?.id?.substring(43)
					const time = renderToString(
						<TimeAgo date={getDateFromTimestamp(commit?.commitEvent?.timestamp)} live={true}/>).replace(/<[^>]*>?/gm, '',
					)
					return(
						<option
							value={idIndex}
							key={index}
						>
								🪙&nbsp;{prettifyCurrency(
								ethers.utils.formatEther(
									ethers.BigNumber.from(commit?.amount),
								),
								0,
								5,
								'ETH',
							)}&#32;🕐&#32;{time}&#32;#️⃣&#32;{prettifyAddress(commit?.commitEvent?.id)}
						</option>
					)
				})}
			</Select>
		</Flex>
	)
}

const RadioCard = (props) => {

	RadioCard.propTypes = {
		children: PropTypes.any,
		set: PropTypes.func.isRequired,
		setting: PropTypes.bool.isRequired,
		pointerEvents: PropTypes.string,
	}

	const { getInputProps, getCheckboxProps } = useRadio(props)
	const input = getInputProps()
	const checkbox = getCheckboxProps()

	return (
		<>
			<Box as='label' width='100%'>
				<input {...input}/>
				<Box
					{...checkbox}

					borderWidth='1px'
					borderRadius='12px'
					fontWeight='600'
					textAlign='center'
					cursor='pointer'
					pointerEvents={props.pointerEvents}
					_hover={{
						background: 'rgba(255,255,255, 0.08)',
					}}
					_checked={{
						color: 'bluish.300',
						borderColor: 'bluish.300',
						borderWidth: '2px',
					}}
					p='0.75rem 1.25rem'
				>
					{props.children}
				</Box>
			</Box>
		</>
	)
}

const PreCommitOptions = (props) => {

	PreCommitOptions.propTypes = {
		set: PropTypes.func.isRequired,
		setting: PropTypes.bool.isRequired,
		opacity: PropTypes.string,
		pointerEvents: PropTypes.string,
	}

	const options = ['Uncommit', 'Commit']

	const { getRootProps, getRadioProps } = useRadioGroup({
		name: 'action',
		value: !props.setting ? 'Uncommit' : 'Commit',
		onChange: () => props.set(!props.setting),
	})
	const group = getRootProps()

	return (
		<HStack
			{...group}
			mt='0.7rem'
			lineHeight='normal'
			opacity={props.opacity}
			pointerEvents={props.pointerEvents}
		>
			{options.map((value) => {
				const radio = getRadioProps({ value })
				return (
					<RadioCard
						set={props.set}
						setting={props.setting}
						key={value} {...radio}>
						{value}
					</RadioCard>
				)
			})}
		</HStack>
	)
}

const PriceOverview = (props) => {

	PriceOverview.propTypes = {
		bond: PropTypes.any.isRequired,
	}

	const { data: bondPrice } = useBondPrice(props.bond?.[0]?.address)
	const [usdcEth] = useUniswapV2Price(defaults.address.uniswapV2.usdcEthPair)
	const [vaderEth] = useUniswapV2Price(defaults.address.uniswapV2.vaderEthPair)
	const [principalEth] = useUniswapV2Price(props.bond?.[0]?.principal?.address, true)
	const preCommit = usePreCommit(props?.bond?.[0]?.precommit)

	return (
		<Flex>
			<Container p='0 6px 6px 2px'>
				<Box textAlign={{ base: 'center', md: 'left' }}>
					<Tag
						width='100%'
						minH={{ base: '77.6667px', md: '95.5167px' }}
						flexDir='column'
						size='lg'
						variant='outline'
						p='18px 0'
					>
						<Box
							fontSize={{ base: '0.87rem', md: '1rem' }}
						>
							{preCommit?.open?.data &&
									props?.bond?.[0]?.discount &&
									<>
										Discount
									</>
							}
							{!preCommit?.open?.data &&
									<>
										Bond Price
									</>
							}
						</Box>
						<TagLabel
							fontSize={{ base: '1.3rem', md: '2.1rem' }}
						>
							{preCommit?.open?.data &&
									props?.bond?.[0]?.discount &&
									<>
										{getPercentage(props.bond?.[0]?.discount)}
									</>
							}
							{!preCommit?.open?.data &&
									<>
										{bondPrice && usdcEth?.pairs?.[0]?.token0Price && principalEth?.principalPrice &&
											<>
												{prettifyCurrency(
													props?.bond?.[0]?.principal ? (Number(ethers.utils.formatUnits(bondPrice, 18)) *
													(Number(usdcEth?.pairs?.[0]?.token0Price) *
													Number(principalEth?.principalPrice))) : (Number(ethers.utils.formatUnits(bondPrice, 18)) *
													(Number(usdcEth?.pairs?.[0]?.token0Price))),
													0, 5)}
											</>
										}
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
						minH={{ base: 'auto', md: '95.5167px' }}
						flexDir='column'
						size='lg'
						variant='outline'
						p='18px 0'
					>
						<Box
							fontSize={{ base: '0.87rem', md: '1rem' }}
						>
							Market Price
						</Box>
						<TagLabel
							fontSize={{ base: '1.3rem', md: '2.1rem' }}
						>
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

const Overview = (props) => {

	Overview.propTypes = {
		bondInfo: PropTypes.array,
		pendingPayout: PropTypes.object,
	}

	return (
		<>
			<Flex
				flexDir='column'
				p='0 0.15rem'
				mt={{ base: '1.2rem', md: '' }}
				marginBottom='.7rem'
				opacity='0.87'
				minH={{ base: '', md: '157.767px' }}
			>
				{props.bondInfo?.[0]?.gt(0) &&
					<>
						<Text
							as='h4'
							fontSize='1.24rem'
							fontWeight='bolder'>
								Overview
						</Text>

						<Flex>
							<Container p='0'>
								<Box
									textAlign='left'
								>
								Remains vested
								</Box>
							</Container>
							<Container p='0'>
								<Box
									textAlign='right'
								>
									<>
										{prettifyCurrency(
											props.bondInfo?.[0] ? ethers.utils.formatUnits(props.bondInfo?.[0], defaults.vader.decimals) : 0,
											0,
											5,
											'VADER',
										)
										}
									</>
								</Box>
							</Container>
						</Flex>
						{props.bondInfo?.[1] && props.bondInfo?.[1]?.gt(0) &&
							<Flex>
								<Container
									maxW='none'
									mt='4px'
									p='0'>
									<Tag size='md' colorScheme='cyan' borderRadius='full'>
										<TagLeftIcon as={CheckCircleIcon}/>
										<TagLabel>Purchased</TagLabel>
									</Tag>
								</Container>
							</Flex>
						}
					</>
				}
			</Flex>
		</>
	)
}

const Breakdown = (props) => {

	Breakdown.propTypes = {
		value: PropTypes.any.isRequired,
		useLPTokens: PropTypes.bool.isRequired,
		treasuryBalance: PropTypes.object,
		maxPayout: PropTypes.object,
		bond: PropTypes.any.isRequired,
	}

	const { data: bondPrice } = useBondPrice(props.bond?.[0]?.address)
	const [usdcEth] = useUniswapV2Price(defaults.address.uniswapV2.usdcEthPair)
	const [vaderEth] = useUniswapV2Price(defaults.address.uniswapV2.vaderEthPair)
	const [principalEth] = useUniswapV2Price(props.bond?.[0]?.principal?.address, true)
	const { data: terms } = useBondTerms(props.bond?.[0]?.address, true)

	const bondInitPrice = props.bond?.[0]?.principal ? (Number(ethers.utils.formatUnits(bondPrice ? bondPrice : '0', 18)) *
	(Number(usdcEth?.pairs?.[0]?.token0Price) * Number(principalEth?.principalPrice))) : (Number(ethers.utils.formatUnits(bondPrice ? bondPrice : '0', 18)) *
	(Number(usdcEth?.pairs?.[0]?.token0Price)))
	const marketPrice = (Number(usdcEth?.pairs?.[0]?.token0Price) * Number(vaderEth?.pairs?.[0]?.token1Price))
	const roi = calculateDifference(marketPrice, bondInitPrice)
	const roiPercentage = isFinite(roi) ? getPercentage(roi)?.replace('-0', '0') : ''
	const preCommit = usePreCommit(props.bond?.[0]?.precommit)
	const totalCommits = useERC20Balance(defaults.address.wrappedEth, props?.bond?.[0]?.precommit)

	return (
		<>
			<Flex
				flexDir='column'
				p='0 0.15rem'
				mt={{ base: '1.2rem', md: '' }}
				marginBottom='.7rem'
				opacity='0.87'
				minH='157.767px'
			>
				<Text
					as='h4'
					fontSize={{ base: '1rem', md: '1.24rem' }}
					fontWeight='bolder'>
					Breakdown
				</Text>

				{!preCommit?.open?.data &&
					<>
						<Flex>
							<Container p='0'>
								<Box
									textAlign='left'
								>
									Total Bonds for Sale
								</Box>
							</Container>
							<Container p='0'>
								<Box
									textAlign='right'
								>
									{props.treasuryBalance &&
										<>
											{props.treasuryBalance.gt(defaults.bondConsideredSoldOutMinVader) &&
												prettifyCurrency(
													ethers.utils.formatUnits(props.treasuryBalance, 18),
													0,
													2,
													'VADER',
												)}
											{props.treasuryBalance.lte(defaults.bondConsideredSoldOutMinVader) &&
												'Sold Out'
											}
										</>
									}
								</Box>
							</Container>
						</Flex>

						<Flex>
							<Container p='0'>
								<Box
									textAlign='left'
								>
									Transaction Cap
								</Box>
							</Container>
							<Container p='0'>
								<Box
									textAlign='right'
								>
									{props.treasuryBalance &&
												<>
													{props.treasuryBalance.gt(defaults.bondConsideredSoldOutMinVader) &&
													prettifyCurrency(
														props.treasuryBalance
															.lte(props.maxPayout) ?
															ethers.utils.formatUnits(props.treasuryBalance, 18) :
															ethers.utils.formatUnits(props.maxPayout, 18),
														0,
														2,
														'VADER',
													)}
													{props.treasuryBalance.lte(defaults.bondConsideredSoldOutMinVader) &&
														'Sold Out'
													}
												</>
									}
								</Box>
							</Container>
						</Flex>
					</>
				}

				{preCommit?.open?.data &&
					<>
						<Flex>
							<Container p='0'>
								<Box
									textAlign='left'
								>
									Pre-commits
								</Box>
							</Container>
							<Container p='0'>
								<Box
									textAlign='right'
								>
									{preCommit.count.data && preCommit.maxCommits.data &&
										<>
											{preCommit?.count?.data?.toNumber()} out of {preCommit?.maxCommits?.data?.toNumber()}
										</>
									}
								</Box>
							</Container>
						</Flex>

						<Flex>
							<Container p='0'>
								<Box
									textAlign='left'
								>
									Total commited
								</Box>
							</Container>
							<Container p='0'>
								<Box
									textAlign='right'
								>
									{totalCommits?.data &&
										<>
											{prettifyCurrency(utils.formatEther(totalCommits?.data), 0, 4, 'ETH')}
										</>
									}
								</Box>
							</Container>
						</Flex>
					</>
				}

				{(props?.bond?.[0]?.discount ||
					roiPercentage > 0) &&
				<Flex minH='24px'>
					<Container p='0'>
						<Box
							textAlign='left'>
							Discount
						</Box>
					</Container>
					<Container p='0'>
						<Box
							textAlign='right'>
							{preCommit?.open?.data &&
									props?.bond?.[0]?.discount &&
									<>
										{getPercentage(props?.bond?.[0]?.discount)}&nbsp;on sale initialization spot price
									</>
							}
							{!preCommit?.open?.data &&
							roiPercentage &&
									<>
										{roiPercentage}
									</>
							}
						</Box>
					</Container>
				</Flex>
				}

				<Flex minH='48px'>
					<Container p='0'>
						<Box
							textAlign='left'>
							Vesting Term
						</Box>
					</Container>
					<Container p='0'>
						{terms &&
							<Box
								textAlign='right'>
							~ {prettifyNumber((Number(terms[1]) / Number(defaults.network.blockTime.hour)) / 24, 0, 1)} days or <i>{(Number(terms[1]))}</i> blocks
							</Box>
						}
					</Container>
				</Flex>
			</Flex>
		</>
	)
}

export default Bond
