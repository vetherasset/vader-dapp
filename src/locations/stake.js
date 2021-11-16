/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box, Button,	Flex, Text, Tab, TabList, Tabs, TabPanels, TabPanel, NumberInput, NumberInputField,
	Input, InputGroup, InputRightElement, InputRightAddon, useToast, Image, Container, Heading, Badge, Spinner, Link,
} from '@chakra-ui/react'
import defaults from '../common/defaults'
import { useWallet } from 'use-wallet'
import { ethers } from 'ethers'
import {
	getERC20BalanceOf,
	getERC20Allowance,
	approveERC20ToSpend,
	stakeVader,
	unstakeVader,
} from '../common/ethereum'
import { getXVaderPrice, getXVaderApy } from '../common/calculation'
import { approved, rejected, failed, walletNotConnected, noAmount, staked,
	unstaked, tokenValueTooSmall, noToken0, exception, insufficientBalance } from '../messages'
import { prettifyNumber, getPercentage } from '../common/utils'

const Stake = (props) => {

	const wallet = useWallet()
	const [token0balance, setToken0balance] = useState(ethers.BigNumber.from('0'))
	const [token1balance, setToken1balance] = useState(ethers.BigNumber.from('0'))
	const [xvdrExchangeRate, setXvdrExchangeRate] = useState(0)
	const [stakingApy, setStakingApy] = useState(0)
	const [refreshDataToken, setRefreshDataToken] = useState(Date.now())

	const stakedNow = `
		@keyframes colorAnimation {
			0% { color: white; }
			50% { color: #f44ca2; }
			100% { color: white; }
		}
	`

	useEffect(() => {
		getXVaderPrice().then(price => {
			setXvdrExchangeRate(Number(price))
		})
	}, [wallet.account, refreshDataToken])

	useEffect(() => {
		getXVaderApy()
			.then((apy) => {
				setStakingApy(Number(apy))
			})
	}, [wallet.account, refreshDataToken])

	useEffect(() => {
		if (wallet.account) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getERC20BalanceOf(
				defaults.address.xvader,
				wallet.account,
				provider,
			)
				.then(data => {
					setToken1balance(data)
				})
				.catch(console.error)
		}
		return () => setToken1balance(ethers.BigNumber.from('0'))
	}, [wallet.account, refreshDataToken])

	useEffect(() => {
		if (wallet.account) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getERC20BalanceOf(
				defaults.address.vader,
				wallet.account,
				provider,
			)
				.then(data => {
					setToken0balance(data)
				})
				.catch(console.error)
		}
		return () => setToken0balance(ethers.BigNumber.from('0'))
	}, [wallet.account, refreshDataToken])

	return (
		<Box
			height={`calc(100vh - ${defaults.layout.header.minHeight})`}
			maxWidth={defaults.layout.container.lg.width}
			m='0 auto'
			p={{ base: '5rem 1.2rem 0', md: '5rem 0 0' }}
			{...props}
		>
			<Flex
				pb={{ base: '6rem', md: '0' }}
				flexDir={{ base: 'column', md: 'row' }}
			>
				<Flex
					flexDir='column'
					w='100%'
					paddingRight={{ base: '0', md: '2rem' }}
					paddingTop={{ base: '0', md: '2.33rem' }}
					justifyContent='flex-start'
				>
					<Flex
						marginBottom={{ base: '1.2rem', md: '0' }}
					>
						<Container mb='23px' p='0'>
							<>
								<Heading as='h1' size='md'>EARN ADDITIONAL VADER.</Heading>
								<Box as='p' mb='0.65rem'>Stake your <i>VADER</i> for <i>xVADER</i> and maximize your yield. No&nbsp;Impermanent Loss.</Box>
								<Box as='p'><b>xVADER</b> is fully composable that can interact with other protocols and you&lsquo;ll receive voting rights with your <i>xVADER</i>.
									Your <i>xVADER</i> will continuously compound, and when you unstake your <i>xVADER</i>, you&lsquo;ll receive your original deposited <b>VADER</b> plus any additional <i>VADER</i> accrued.</Box>
							</>
						</Container>
					</Flex>

					<Flex>
						<Container p='0'>
							<Box textAlign={{ base: 'center', md: 'left' }}>
								<Badge
									fontSize='1rem'
									colorScheme='accent'
								>7 DAYS APY</Badge>
							</Box>
							{stakingApy >= 0 &&
								<Box
									fontSize={{ base: '1.3rem', md: '2.3rem', lg: '2.3rem' }}
									lineHeight='1.2'
									fontWeight='normal'
									mb='23px'
									textAlign={{ base: 'center', md: 'left' }}>
									{getPercentage(stakingApy)}
								</Box>
							}
						</Container>

						<Container p='0'>
							<Box textAlign={{ base: 'center', md: 'left' }}>
								<Badge
									fontSize='1rem'
									colorScheme='accent'
								>1 xVADER RATE</Badge>
							</Box>
							{xvdrExchangeRate > 0 &&
									<Box
										fontSize={{ base: '1.3rem', md: '2.3rem', lg: '2.3rem' }}
										lineHeight='1.2'
										fontWeight='normal'
										mb='23px'
										textAlign={{ base: 'center', md: 'left' }}>
										{prettifyNumber(xvdrExchangeRate, 0, 5)}
									</Box>
							}
						</Container>
					</Flex>

					{token1balance.gt(0) &&
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
										YOU&#39;RE STAKING NOW
								</Heading>
							</>
					}

					{((token0balance.gt(0)) && (!token1balance.gt(0))) &&
							<>
								<Heading
									as='h2'
									size='sm'
								>
										YOUR BALANCE
								</Heading>
							</>
					}

					{token1balance.gt(0) &&
						<>
							<Flex mb='0.354rem'>
								<Container p='0'>
									<Box
										textAlign={{ base: 'center', md: 'left' }}
									>
										<Flex
											justifyContent={{ base: 'center', md: '' }}
											fontWeight='bolder'>
											<Image
												width='23px'
												height='23px'
												borderRadius='50%'
												objectFit='none'
												background='#fff'
												mr='10px'
												src={defaults.unstakeable[0].logoURI}
											/>
												xVADER
										</Flex>
									</Box>
								</Container>
								<Container p='0'>
									<Box textAlign='left'>
										{token1balance.gt(0) &&
											prettifyNumber(
												ethers.utils.formatUnits(
													token1balance,
													defaults.unstakeable[0].decimals,
												),
												0,
												5)
										}
									</Box>
								</Container>
							</Flex>
						</>
					}
					{token0balance.gt(0) &&
						<>
							<Flex>
								<Container p='0'>
									<Box
										textAlign={{ base: 'center', md: 'left' }}>
										<Flex
											justifyContent={{ base: 'center', md: '' }}
											fontWeight='bolder'>
											<Image
												width='23px'
												height='23px'
												borderRadius='50%'
												objectFit='none'
												background='#fff'
												mr='10px'
												src={defaults.stakeable[0].logoURI}
											/>
												VADER
										</Flex>
									</Box>
								</Container>
								<Container p='0'>
									<Box textAlign='left'>
										{token0balance.gt(0) &&
											prettifyNumber(
												ethers.utils.formatUnits(
													token0balance,
													defaults.stakeable[0].decimals,
												),
												0,
												5)
										}
									</Box>
								</Container>
							</Flex>
						</>
					}
				</Flex>

				<Flex
					w={{ base: '100%', md: '77%' }}
					minH='478.65px'
					margin={{ base: '1.3rem auto 0 auto', md: '0 auto' }}
					p='0 0 2rem'
					layerStyle='colorful'
					flexDir='column'
				>
					<Tabs isFitted colorScheme='bluish'>
						<TabList mb='1rem'>
							<Tab p='1.5rem 0' _focus={{
								boxShadow: '0',
								borderRadius: '24px 0 0 0',
							}}>
								<Text as='h3' m='0' fontSize='1.24rem'>
            		Stake
								</Text>
							</Tab>
							<Tab p='1.5rem 0' _focus={{
								boxShadow: '0',
								borderRadius: '0 24px 0 0',
							}}>
								<Text as='h3' m='0' fontSize='1.24rem'>
            		Unstake
								</Text>
							</Tab>
						</TabList>
						<TabPanels
							p={{ base: '0 0.9rem', md: '0 2.6rem' }}
						>
							<TabPanel p='0'>
								<StakePanel
									exchangeRate={xvdrExchangeRate}
									balance={token0balance}
									refreshData={setRefreshDataToken}
								/>
							</TabPanel>
							<TabPanel p='0'>
								<UnstakePanel
									exchangeRate={xvdrExchangeRate}
									balance={token1balance}
									refreshData={setRefreshDataToken}
								/>
							</TabPanel>
						</TabPanels>
					</Tabs>
				</Flex>
			</Flex>
		</Box>
	)
}

const ExchangeRate = (props) => {

	ExchangeRate.propTypes = {
		rate: PropTypes.number.isRequired,
	}

	return (
		<>
			{props.rate > 0 &&
				<>
					1 xVADER = {prettifyNumber(props.rate, 0, 2)} VADER
				</>
			}
		</>
	)
}

const StakePanel = (props) => {

	StakePanel.propTypes = {
		exchangeRate: PropTypes.number.isRequired,
		balance: PropTypes.object.isRequired,
		refreshData: PropTypes.func,
	}

	const wallet = useWallet()
	const toast = useToast()
	const [value, setValue] = useState(0)
	const [inputAmount, setInputAmount] = useState('')
	const [token0] = useState(defaults.stakeable[0])
	const [token0Approved, setToken0Approved] = useState(false)
	const [working, setWorking] = useState(false)

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
					defaults.address.xvader,
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
				if ((props.balance.gte(value))) {
					const provider = new ethers.providers.Web3Provider(wallet.ethereum)
					setWorking(true)
					stakeVader(
						value,
						provider)
						.then((tx) => {
							tx.wait(
								defaults.network.tx.confirmations,
							).then((r) => {
								setWorking(false)
								props.refreshData(Date.now())
								toast({
									...staked,
									description: <Link
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
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getERC20Allowance(
				token0.address,
				wallet.account,
				defaults.address.xvader,
				provider,
			).then((n) => {
				setWorking(false)
				if(n.gt(0))	setToken0Approved(true)
			})
		}
		return () => {
			setWorking(true)
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
					<Text
						as='h4'
						fontSize={{ base: '0.8rem', md: '1rem' }}
					>
						<ExchangeRate rate={props.exchangeRate} />
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
								ethers.utils.formatUnits(props.balance, token0.decimals),
							)
							setValue(props.balance)
						}}>
							MAX
					</Button>
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
				</Flex>
				<Flex mt='5.05rem' justifyContent='center'>
					<Button
						minWidth='230px'
						size='lg'
						variant='solidRadial'
						disabled={working}
						onClick={() => submit()}
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
													Stake
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
									Stake
								</>
							}
						</Text>
					</Button>
				</Flex>
			</Flex>
		</>
	)
}

const UnstakePanel = (props) => {

	UnstakePanel.propTypes = {
		exchangeRate: PropTypes.number.isRequired,
		balance: PropTypes.object.isRequired,
		refreshData: PropTypes.func,
	}

	const wallet = useWallet()
	const toast = useToast()
	const [value, setValue] = useState(0)
	const [inputAmount, setInputAmount] = useState('')
	const [token0] = useState(defaults.unstakeable[0])
	const [token0Approved, setToken0Approved] = useState(false)
	const [working, setWorking] = useState(false)

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
					defaults.address.xvader,
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
				if ((props.balance.gte(value))) {
					const provider = new ethers.providers.Web3Provider(wallet.ethereum)
					setWorking(true)
					unstakeVader(
						value,
						provider)
						.then((tx) => {
							tx.wait(
								defaults.network.tx.confirmations,
							).then((r) => {
								setWorking(false)
								props.refreshData(Date.now())
								toast({
									...unstaked,
									description: <Link
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
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getERC20Allowance(
				token0.address,
				wallet.account,
				defaults.address.xvader,
				provider,
			).then((n) => {
				setWorking(false)
				if(n.gt(0))	setToken0Approved(true)
			})
		}
		return () => {
			setWorking(true)
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
					<Text
						fontSize={{ base: '0.8rem', md: '1rem' }}
						as='h4'>
						<ExchangeRate rate={props.exchangeRate} />
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
								ethers.utils.formatUnits(props.balance, token0.decimals),
							)
							setValue(props.balance)
						}}>
							MAX
					</Button>
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
				</Flex>
				<Flex mt='5.05rem' justifyContent='center'>
					<Button
						minWidth='230px'
						size='lg'
						variant='solidRadial'
						disabled={working}
						onClick={() => submit()}
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
													Unstake
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
									Unstake
								</>
							}
						</Text>
					</Button>
				</Flex>
			</Flex>
		</>
	)
}

export default Stake
