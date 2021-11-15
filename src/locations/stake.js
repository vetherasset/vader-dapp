/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box, Button,	Flex, Text, Tab, TabList, Tabs, TabPanels, TabPanel, NumberInput, NumberInputField,
	InputGroup, InputRightElement, useToast, Image, Container, Heading, Badge, Spinner, Link,
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
	unstaked, tokeValueTooSmall, noToken0, exception, insufficientBalance } from '../messages'
import { prettifyNumber } from '../common/utils'

const Stake = props => {
	const wallet = useWallet()
	const [accessApproved, setAccessApproved] = useState(false)
	const [vdrBalance, setVdrBalance] = useState(0)
	const [xvdrBalance, setXvdrBalance] = useState(0)
	const [xvdrExchangeRate, setXvdrExchangeRate] = useState(0)
	const [stakeApy, setStakeApy] = useState(0)
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
	}, [refreshDataToken])

	useEffect(() => {
		getXVaderApy().then(apy => {
			setStakeApy(Number(apy))
		})
	}, [refreshDataToken])

	useEffect(() => {
		if (wallet.account) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getERC20Allowance(
				defaults.address.vader,
				wallet.account,
				defaults.address.xvader,
				provider,
			)
				.then(data => {
					setAccessApproved(data.gt(0))
				})
				.catch(console.error)
		}
	}, [wallet.account, refreshDataToken])

	useEffect(() => {
		if (wallet.account) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getERC20BalanceOf(defaults.address.vader, wallet.account, provider)
				.then(data => {
					setVdrBalance(+ethers.utils.formatEther(data))
				})
				.catch(console.error)
		}
	}, [wallet.account, refreshDataToken])

	useEffect(() => {
		if (wallet.account) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getERC20BalanceOf(defaults.address.xvader, wallet.account, provider)
				.then(data => {
					setXvdrBalance(+ethers.utils.formatEther(data))
				})
				.catch(console.error)
		}
	}, [wallet.account, refreshDataToken])

	return (
		<Box
			height={`calc(100vh - ${defaults.layout.header.minHeight})`}
			maxWidth={defaults.layout.container.lg.width}
			m='0 auto'
			p={{ base: '5rem 1.2rem 0', md: '5rem 0 0' }}
			{...props}
		>
			<Flex>
				<Flex
					flexDir='column'
					w='100%'
					paddingRight='2rem'
					justifyContent='center'
				>
					<Flex>
						<Container mb='23px' p='0'>
							<Heading as='h1' size='md'>EARN ADDITIONAL VADER.</Heading>
							<Box as='p' mb='0.65rem'>Stake your <i>VADER</i> for <i>xVADER</i> and maximize your yield. No&nbsp;Impermanent Loss.</Box>
							<Box as='p'><b>xVADER</b> is fully composable that can interact with other protocols and you&lsquo;ll receive voting rights with your <i>xVADER</i>.
							Your <i>xVADER</i> will continuously compound, and when you unstake your <i>xVADER</i>, you&lsquo;ll receive your original deposited <b>VADER</b> plus any additional <i>VADER</i> accrued.</Box>
						</Container>
					</Flex>

					<Flex>
						<Container p='0'>
							<Box textAlign='left'>
								<Badge
									fontSize='1rem'
									colorScheme='accent'
								>7 DAYS APY</Badge>
							</Box>
							<Box fontSize={{ base: '1.3rem', md: '2.3rem', lg: '2.3rem' }} lineHeight='1.2' fontWeight='normal' mb='19px' textAlign='left'>
						2159%
							</Box>
						</Container>

						{xvdrExchangeRate > 0 &&
							<Container p='0'>
								<Box textAlign='left'>
									<Badge
										fontSize='1rem'
										colorScheme='accent'
									>1 xVADER RATE</Badge>
								</Box>
								<Box fontSize={{ base: '1.3rem', md: '2.3rem', lg: '2.3rem' }} lineHeight='1.2' fontWeight='normal' mb='19px' textAlign='left'>
									{prettifyNumber(xvdrExchangeRate, 0, 5)}
								</Box>
							</Container>
						}
					</Flex>

					{/* <Flex>
						<Container mb='17px' p='0'>
							<style>
								{stakedNow}
							</style>
							<Heading
								as='h1'
								size='md'
								animation='5s ease-in-out infinite colorAnimation'
								transition='all 0.3s ease 0s'>
									YOU&#39;RE STAKED NOW.
							</Heading>
						</Container>
					</Flex>

					<Flex mb='0.6rem'>
						<Container p='0'>
							<Box textAlign='left'>
								<Badge
									fontSize='1rem'
									colorScheme='accent'
								>7 DAYS APY</Badge>
							</Box>
							<Box fontSize={{ base: '1.3rem', md: '2.3rem', lg: '2.3rem' }} lineHeight='1.2' fontWeight='normal' mb='19px' textAlign='left'>
						2159%
							</Box>
						</Container>
						<Container p='0'>
							<Box textAlign='left'>
								<Badge
									fontSize='1rem'
									colorScheme='accent'
								>1 xVADER RATE</Badge>
							</Box>
							<Box fontSize={{ base: '1.3rem', md: '2.3rem', lg: '2.3rem' }} lineHeight='1.2' fontWeight='normal' mb='19px' textAlign='left'>
						1 VADER
							</Box>
						</Container>
					</Flex>

					<Flex>
						<Container p='0'>
							<Text
								as='h4'
								fontSize='1.24rem'
								fontWeight='bolder'>
							Asset
							</Text>
						</Container>
						<Container p='0'>
							<Text
								as='h4'
								fontSize='1.24rem'
								fontWeight='bolder'>
							Balance
							</Text>
						</Container>
					</Flex>

					<Flex mb='1rem'>
						<Container p='0'>
							<Box textAlign='left'>
								<Flex
									fontWeight='bolder'>
									<Image
										width='23px'
										height='23px'
										borderRadius='50%'
										objectFit='none'
										background='#fff'
										mr='10px'
										src='https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1547036627'
									/>
								VADER
								</Flex>
							</Box>
						</Container>
						<Container p='0'>
							<Box textAlign='left'>
								1000
							</Box>
						</Container>
					</Flex>

					<Flex>
						<Container p='0'>
							<Box textAlign='left'>
								<Flex
									fontWeight='bolder'>
									<Image
										width='23px'
										height='23px'
										borderRadius='50%'
										objectFit='none'
										background='#fff'
										mr='10px'
										src='https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1547036627'
									/>
								xVADER
								</Flex>
							</Box>
						</Container>
						<Container p='0'>
							<Box textAlign='left'>
								85589
							</Box>
						</Container>
					</Flex> */}
				</Flex>
				<Flex
					w='77.777%'
					minH='478.65px'
					m='0 auto'
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
							p='0 2.6rem'
						>
							<TabPanel p='0'>
								<StakePanel
									exchangeRate={xvdrExchangeRate}
									accessApproved={accessApproved}
									balance={vdrBalance}
									refreshData={setRefreshDataToken}
								/>
							</TabPanel>
							<TabPanel p='0'>
								<UnstakePanel
									exchangeRate={xvdrExchangeRate}
									balance={xvdrBalance}
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
					1 xVADER = {prettifyNumber(props.rate, 2, 6)} VADER
				</>
			}
		</>
	)
}

const StakePanel = (props) => {

	StakePanel.propTypes = {
		exchangeRate: PropTypes.number.isRequired,
		accessApproved: PropTypes.bool.isRequired,
		balance: PropTypes.number.isRequired,
		refreshData: PropTypes.func,
	}

	const wallet = useWallet()
	const toast = useToast()
	const [amount, setAmount] = useState(0)
	const [token0] = useState(defaults.stakeable[0])
	const [token0Approved, setToken0Approved] = useState(false)
	const [token0balance, setToken0balance] = useState(0)
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
					defaults.address.pool,
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
			else if ((amount > 0)) {
				if ((token0balance.gte(amount))) {
					const provider = new ethers.providers.Web3Provider(wallet.ethereum)
					setWorking(true)
					stakeVader(
						amount,
						provider)
						.then((tx) => {
							tx.wait(
								defaults.network.tx.confirmations,
							).then((r) => {
								setWorking(false)
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

	const setMaxAmount = () => {
		setAmount(props.balance)
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
				console.log(n)
				if(n.gt(0))	setToken0Approved(true)
			})
		}
		return () => {
			setWorking(true)
			setToken0Approved(false)
		}
	}, [wallet.account, token0])

	useEffect(() => {
		if (wallet.account && token0) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getERC20BalanceOf(
				token0.address,
				wallet.account,
				provider,
			).then((b) => {
				setToken0balance(b)
			})
		}
		return () => setToken0balance(0)
	}, [wallet.account, token0, working])

	return (
		<>
			<Flex
				mt='4.2rem'
				flexDir='column'>
				<Flex alignItems="center" justifyContent="space-between">
					<Text as='h4' fontSize='1.24rem' fontWeight='bolder'>Amount</Text>
					<Text as='h4'>
						<ExchangeRate rate={props.exchangeRate} />
					</Text>
				</Flex>
				<Flex
					layerStyle='inputLike'
				>
					<InputGroup>
						<NumberInput
							variant='transparent'
							flex='1'
							min={Number(String('0.').padEnd((token0.decimals - 1), '0') + '1')}
							onChange={(n) => {
								if(Number(n) > 0) {
									try {
										setAmount(ethers.utils.parseUnits(String(n), token0.decimals))
									}
									catch(e) {
										if (e.code === 'NUMERIC_FAULT') {
											toast(tokeValueTooSmall)
										}
									}
								}
							}}						>
							<NumberInputField
								placeholder='0.0'
								fontSize='1.3rem'
								fontWeight='bold'
							/>
						</NumberInput>
						<InputRightElement
							width='auto'
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
						</InputRightElement>
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
						onClick={setMaxAmount}>
							MAX
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={setMaxAmount}>
							25%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={setMaxAmount}>
							50%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={setMaxAmount}>
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

const UnstakePanel = props => {

	const [amount, setAmount] = useState('')
	const [processingTxStatus, setProcessingTxStatus] = useState(false)

	const wallet = useWallet()
	const toast = useToast()
	const [tokenSelect] = useState(defaults.unstakeable[0])
	const setMaxAmount = () => {
		setAmount(props.balance)
	}

	const handleChange = value => {
		if (value > props.balance) {
			value = props.balance
		}
		setAmount(value)
	}

	const approveAccess = async provider => {
		return approveERC20ToSpend(
			defaults.address.vader,
			defaults.address.xvader,
			'0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
			provider,
		)
	}

	const stake = async provider => {
		try {
			const ret = await stakeVader(
				ethers.utils.parseEther(String(amount)),
				provider,
			)
			provider.once(ret.hash, tx => {
				setProcessingTxStatus(false)
				if (tx.status === 1) {
					props.refreshData(Date.now())
					setAmount(0)
					return toast(staked)
				}
				else {
					return toast(failed)
				}
			})
		}
		catch (error) {
			console.error(error)
			setProcessingTxStatus(false)
			if (error.code === 4001) {
				return toast(rejected)
			}
			toast(failed)
		}
	}

	const submit = async () => {
		if (!wallet.account) {
			return toast(walletNotConnected)
		}
		if (!amount) {
			return toast(noAmount)
		}
		const provider = new ethers.providers.Web3Provider(wallet.ethereum)
		setProcessingTxStatus(true)
		try {
			const ret = await approveAccess(provider)
			provider.once(ret.hash, tx => {
				if (tx.status === 1) {
					toast(approved)
					props.refreshData(Date.now())
					return stake(provider)
				}
				else {
					setProcessingTxStatus(false)
					return toast(failed)
				}
			})
		}
		catch (error) {
			console.error(error)
			setProcessingTxStatus(false)
			if (error.code === 4001) {
				return toast(rejected)
			}
			toast(failed)
		}
	}
	return (
		<>
			<Flex
				mt='4.2rem'
				flexDir='column'>
				<Flex alignItems="center" justifyContent="space-between">
					<Text as='h4' fontSize='1.24rem' fontWeight='bolder'>Amount</Text>
					<Text as='h4'>
						<ExchangeRate rate={props.exchangeRate} />
					</Text>
				</Flex>
				<Flex
					layerStyle='inputLike'
				>
					<InputGroup>
						<NumberInput
							variant="transparent"
							flex="1"
							value={amount}
							max={props.balance}
							onChange={handleChange}
						>
							<NumberInputField
								placeholder="0"
								fontSize="1.3rem"
								fontWeight="bold"
							/>
						</NumberInput>
						<InputRightElement
							width='auto'
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
										src={tokenSelect.logoURI}
									/>
									<Box
										as='h3'
										m='0'
										fontSize='1.02rem'
										fontWeight='bold'
									>{tokenSelect.symbol}</Box>
								</Box>
							</Flex>
						</InputRightElement>
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
						onClick={setMaxAmount}>
							MAX
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={setMaxAmount}>
							25%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={setMaxAmount}>
							50%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={setMaxAmount}>
							75%
					</Button>
				</Flex>
				<Flex mt='5.05rem' justifyContent='center'>
					<Button
						minWidth="230px"
						size="lg"
						variant="solidRadial"
						onClick={submit}
						disabled={processingTxStatus}
					>
						<Text fontWeight="bold">
								UNSTAKE
						</Text>
					</Button>
				</Flex>
			</Flex>
		</>
	)
}
UnstakePanel.propTypes = {
	exchangeRate: PropTypes.number.isRequired,
	balance: PropTypes.number.isRequired,
	refreshData: PropTypes.func,
}

export default Stake
