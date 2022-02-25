import React, { useState, useEffect } from 'react'
import { useLocalStorage } from 'react-use'
import { Box, Button,	Flex, Text, Tab, TabList, Tabs, TabPanels, TabPanel,
	Input, InputGroup, InputRightAddon, useToast, Image, Container, Heading, Spinner, Link,
	Stack, Radio, RadioGroup,
} from '@chakra-ui/react'
import defaults from '../common/defaults'
import { useWallet } from 'use-wallet'
import { ethers } from 'ethers'
import {
	getERC20Allowance,
	approveERC20ToSpend,
	stakeForRewards,
	getStakingRewards,
	exitStakingRewards,
} from '../common/ethereum'
import { TokenJazzicon } from '../components/TokenJazzicon'
import { useERC20Balance } from '../hooks/useERC20Balance'
import { approved, rejected, failed, walletNotConnected, noAmount, staked,
	tokenValueTooSmall, noToken0, exception, insufficientBalance, noRewardToWithdraw, noDepositToWithdraw, stakedForRewards, rewardsWithdrawn, rewardsExited } from '../messages'
import { useStakingRewardsBalanceOf } from '../hooks/useStakingRewardsBalanceOf'
import { useStakingRewardsEarned } from '../hooks/useStakingRewardsEarned'
import { prettifyNumber, prettifyCurrency, openNewTabURL } from '../common/utils'

const Earn = (props) => {

	const wallet = useWallet()
	const balance = useStakingRewardsBalanceOf(wallet?.account)
	const earned = useStakingRewardsEarned(wallet?.account)

	return (
		<Box
			minHeight='688.617px'
			maxWidth={defaults.layout.container.lg.width}
			m='0 auto'
			p={{ base: '5rem 0.4rem 0', md: '5rem 1.2rem 0' }}
			{...props}
		>
			<Flex
				marginBottom={{ base: '1.2rem', md: '0' }}
			>
				<Container mb='23px' p='0'>
					<>
						<Heading
							as='h1'
							size='md'
							textAlign='center'
							fontSize={{ base: '1.10rem', md: '1.25rem' }}>Farm to maximize your yield.</Heading>
						<Box
							as='p'
							mb='0.65rem'
							textAlign='center'
							fontSize={{ base: '0.9rem', md: '1rem' }}
						>
							Earn unlocked <i>VADER</i> liquidity incentives by staking your <i>USDV3CRV-f</i><br/>LP tokens to the platform.
						</Box>
					</>
				</Container>
			</Flex>
			<Flex
				flexDir={{ base: 'column', md: 'row' }}
			>
				<Flex
					w={{ base: '100%', md: '77%' }}
					margin={{ base: '1.3rem auto 0 auto', md: '0 auto' }}
					p='0 0 2rem'
					flexDir='column'
				>
					<Flex
						layerStyle='colorful'
						height='482.95px'
						marginTop='2.33rem'
					>
						<Tabs
							width='100%'
							isFitted colorScheme='bluish'>
							<TabList mb='1rem'>
								<Tab p='1.5rem 0' _focus={{
									boxShadow: '0',
									borderRadius: '24px 0 0 0',
								}}>
									<Text as='h3' m='0' fontSize='1.24rem'>
            				Deposit
									</Text>
								</Tab>
								<Tab p='1.5rem 0' _focus={{
									boxShadow: '0',
									borderRadius: '0 24px 0 0',
								}}>
									<Text as='h3' m='0' fontSize='1.24rem'>
									Withdraw
									</Text>
								</Tab>
							</TabList>
							<TabPanels
								p={{ base: '0 0.9rem', md: '0 2.6rem' }}
							>
								<TabPanel p='0'>
									<StakePanel/>
								</TabPanel>
								<TabPanel p='0'>
									<UnstakePanel
										balance='0'
									/>
								</TabPanel>
							</TabPanels>
						</Tabs>
					</Flex>
				</Flex>

				<Flex
					flexDir='column'
					w='100%'
					paddingRight={{ base: '0', md: '2rem' }}
					paddingTop={{ base: '0', md: '2.33rem' }}
					justifyContent='center'
				>
					<Flex
						flexDir='column'
						marginBottom='2.3rem'
						padding='0 3rem'
						gridGap='17px'
					>
						<Container p='0'>
							<Box textAlign='left'>APR</Box>
							<Box fontSize={{ base: '1.3rem', md: '2.3rem', lg: '2.3rem' }}>
								18%
							</Box>
						</Container>

						<Container p='0'>
							<Box textAlign='left'>
								TVL
							</Box>
							<Box fontSize={{ base: '1.3rem', md: '2.3rem', lg: '2.3rem' }}>
								$23M
							</Box>
						</Container>
					</Flex>
					<Flex
						flexDir='column'
						marginBottom={{ base: '1.2rem', md: '0' }}
						padding='0 3rem'
					>
						{balance?.data?.gt(0) &&
							<>
								<style>
									{stakedNow}
								</style>
								<Heading
									as='h2'
									size='sm'
									textAlign={{ base: 'center', md: 'left' }}
									animation='5s ease-in-out infinite colorAnimation'
									transition='all 0.3s ease 0s'>
										YOU&#39;RE EARNING NOW
								</Heading>
							</>
						}
						{(balance?.data?.gt(0) || earned?.data?.gt(0)) &&
							<Container
								display='flex'
								flexDir='column'
								gridGap='5px'
								minH='109.5px'
								mb='23px'
								p='0'>
								<Text
									as='h4'
									mb='0'
									fontSize='1.24rem'
									fontWeight='bolder'>
								Overview
								</Text>
								<hr style={{
									margin: '0 0 .5rem',
									borderTop: '1px solid #3fa3fa',
									borderBottom: '1px solid #3fa3fa',
									borderRadius: '2px',
								}}/>
								<Flex>
									<Container p='0'>
										<Box
											textAlign='left'
										>
										Reward earned
										</Box>
									</Container>
									<Container p='0'>
										<Box
											textAlign='right'
											fontWeight='bold'
											lineHeight='1.3'
											minH='28.5px'
										>
											{earned?.data &&
											<>
												<Image
													width='24px'
													height='24px'
													display='inline-block'
													position='relative'
													top='6px'
													borderRadius='50%'
													m='0 5px'
													src={defaults?.vader?.logoURI}
													alt={`${defaults?.vader?.name} token`}
												/>
												{prettifyCurrency(ethers.utils.formatEther(earned?.data), 0, 2, 'VADER')}
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
										Total deposit
										</Box>
									</Container>
									<Container p='0'>
										<Box
											textAlign='right'
											fontWeight='bold'
											lineHeight='1.3'
										>
											{balance?.data &&
											<>
												<Box
													display='inline-block'
													position='relative'
													ml='5px'
													top='4px'>
													<TokenJazzicon
														address={defaults.usdv3crvf.address}
														display='inline-block'
													/>
												</Box>
												{prettifyNumber(
													ethers.utils.formatEther(balance?.data),
													0,
													2,
												)}
												&nbsp;USDV3CRV-f
											</>
											}
										</Box>
									</Container>
								</Flex>
							</Container>
						}
						{(!balance?.data?.gt(0) && !earned?.data?.gt(0)) &&
							<Container
								mb='23px'
								p='0'>
								<>
									<Heading
										as='h2'
										size='sm'
										textAlign='left'
									>
										HOW TO PROVIDE LIQUIDITY IN ORDER TO PARTICIPATE
									</Heading>
									<Box
										as='p'
										mb='0.65rem'
									>
										Navigate to
										<Button
											overflow='hidden'
											height='38px'
											variant='linkAccent'
											onClick={() => openNewTabURL('https://curve.fi/factory/82/deposit')}
											rightIcon={<Image src='/svg/curvefi.svg' width='32px'/>}
										>
												USDV3CRV-f pool
										</Button> to provide desired assets.
										When done deposit your LP tokens and start earning.
									</Box>
								</>
							</Container>
						}
					</Flex>
				</Flex>
			</Flex>
		</Box>
	)
}

const StakePanel = () => {

	const wallet = useWallet()
	const toast = useToast()
	const [value, setValue] = useState(0)
	const [inputAmount, setInputAmount] = useState('')
	const [token0] = useState(defaults.usdv3crvf)
	const [token0Approved, setToken0Approved] = useState(false)
	const [working, setWorking] = useState(false)
	const balance = useERC20Balance(token0.address)

	const submit = () => {
		if(!working) {
			if(!wallet.account) {
				toast(walletNotConnected)
			}
			else if (!token0) {
				toast(noToken0)
			}
			else if (token0 && !token0Approved) {
				const provider = new ethers.providers.Web3Provider(wallet.ethereum)
				setWorking(true)
				approveERC20ToSpend(
					token0.address,
					defaults.address.stakingRewards,
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
				if ((balance?.data?.gte(value))) {
					const provider = new ethers.providers.Web3Provider(wallet.ethereum)
					setWorking(true)
					stakeForRewards(
						value,
						provider)
						.then((tx) => {
							tx.wait(
								defaults.network.tx.confirmations,
							).then((r) => {
								setWorking(false)
								toast({
									...stakedForRewards,
									description: <Link
										variant='underline'
										_focus={{
											boxShadow: '0',
										}}
										href={`${defaults.api.etherscanUrl}/tx/${r.transactionHash}`}
										isExternal>
										<Box>Click here to view transaction on <i><b>Etherscan</b></i>.</Box></Link>,
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
					toast(insufficientBalance)
				}
			}
			else {
				toast(noAmount)
			}
		}
	}

	useEffect(() => {
		if(wallet.account && token0) {
			setWorking(true)
			getERC20Allowance(
				token0.address,
				wallet.account,
				defaults.address.stakingRewards,
				defaults.network.provider,
			).then((n) => {
				setWorking(false)
				if(n.gt(0))	setToken0Approved(true)
			})
		}
		return () => {
			setWorking(false)
			setToken0Approved(false)
		}
	}, [wallet.account, token0])

	return (
		<>
			<Flex
				mt='4.2rem'
				flexDir='column'>
				<Flex alignItems="center" justifyContent="space-between">
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
									balance?.data?.div(100).mul(25),
									token0.decimals),
							)
							setValue(balance?.data?.div(100).mul(25))
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
									balance?.data?.div(100).mul(50),
									token0.decimals),
							)
							setValue(balance?.data?.div(100).mul(50))
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
									balance?.data?.div(100).mul(75),
									token0.decimals),
							)
							setValue(balance?.data?.div(100).mul(75))
						}}>
							75%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={() => {
							setInputAmount(
								ethers.utils.formatUnits(balance?.data, token0.decimals),
							)
							setValue(balance?.data)
						}}>
							MAX
					</Button>
				</Flex>
				<Flex mt='5.05rem' justifyContent='center'>
					<Button
						minWidth='230px'
						size='lg'
						variant='solidRadial'
						disabled={working}
						onClick={() => submit()}
					>
						<Text as="span" fontWeight="bold">
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
													Deposit
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
									Deposit
								</>
							}
						</Text>
					</Button>
				</Flex>
			</Flex>
		</>
	)
}

const UnstakePanel = () => {

	const wallet = useWallet()
	const toast = useToast()
	const [working, setWorking] = useState(false)
	const [rewardsOnly, setRewardsOnly] = useLocalStorage('earnRewardsOnly23049', true)
	const balance = useStakingRewardsBalanceOf(wallet?.account)
	const earned = useStakingRewardsEarned(wallet?.account)

	const submit = () => {
		if(!working) {
			if(!wallet.account) {
				toast(walletNotConnected)
			}
			else {
				const provider = new ethers.providers.Web3Provider(wallet.ethereum)
				if (rewardsOnly) {
					if (earned?.data?.gt(0)) {
						setWorking(true)
						getStakingRewards(
							provider)
							.then((tx) => {
								tx.wait(
									defaults.network.tx.confirmations,
								).then((r) => {
									setWorking(false)
									toast({
										...rewardsWithdrawn,
										description: <Link
											variant='underline'
											_focus={{
												boxShadow: '0',
											}}
											href={`${defaults.api.etherscanUrl}/tx/${r.transactionHash}`}
											isExternal>
											<Box>Click here to view transaction on <i><b>Etherscan</b></i>.</Box></Link>,
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
						toast(noRewardToWithdraw)
					}
				}
				else if (balance?.data?.gt(0)) {
					setWorking(true)
					exitStakingRewards(
						provider)
						.then((tx) => {
							tx.wait(
								defaults.network.tx.confirmations,
							).then((r) => {
								setWorking(false)
								toast({
									...rewardsExited,
									description: <Link
										variant='underline'
										_focus={{
											boxShadow: '0',
										}}
										href={`${defaults.api.etherscanUrl}/tx/${r.transactionHash}`}
										isExternal>
										<Box>Click here to view transaction on <i><b>Etherscan</b></i>.</Box></Link>,
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
					toast(noDepositToWithdraw)
				}
			}
		}
	}

	return (
		<>
			<Flex
				mt='2rem'
				flexDir='column'>
				<Flex
					mt='2.2rem'
					flexDir='column'
					justifyContent='space-between'
				>
					<Text
						as='h4'
						m='0'
						fontSize={{ base: '1rem', md: '1.24rem' }}
						fontWeight='bolder'>
							What to withdraw
					</Text>
					<Text
						color='#d7d1d1'
						as='p'>
							Select what would you like to get
					</Text>
				</Flex>
				<RadioGroup
					m='1.3rem 0 0'
					value={!rewardsOnly ? 0 : 1}
					onChange={() => setRewardsOnly(!rewardsOnly)}
				>
					<Stack>
						<Radio
							size='md'
							name='what'
							value={0}
						>
							Withdraw
							<Box
								display='inline-block'
								position='relative'
								ml='5px'
								top='4px'>
								<TokenJazzicon
									address={defaults.usdv3crvf.address}
									display='inline-block'
								/>
							</Box>
							<i>USDV3CRV-f</i> and
							<Image
								width='24px'
								height='24px'
								display='inline-block'
								position='relative'
								top='6px'
								borderRadius='50%'
								m='0 5px'
								src={defaults?.vader?.logoURI}
								alt={`${defaults?.vader?.name} token`}
							/>
							reward
						</Radio>
						<Radio
							size='md'
							value={1}
						>
							Only withdraw earned
							<Image
								width='24px'
								height='24px'
								display='inline-block'
								position='relative'
								top='6px'
								borderRadius='50%'
								m='0 5px'
								src={defaults?.vader?.logoURI}
								alt={`${defaults?.vader?.name} token`}
							/>
							reward
						</Radio>
					</Stack>
				</RadioGroup>
				<Flex
					mt='4.8rem'
					justifyContent='center'>
					<Button
						minWidth='230px'
						size='lg'
						variant='solidRadial'
						disabled={working}
						onClick={() => submit()}
					>
						<Text as="span" fontWeight="bold">
							Withdraw
						</Text>
					</Button>
				</Flex>
			</Flex>
		</>
	)
}

const stakedNow = `
@keyframes colorAnimation {
	0% { color: white; }
	50% { color: #f44ca2; }
	100% { color: white; }
}
`

export default Earn
