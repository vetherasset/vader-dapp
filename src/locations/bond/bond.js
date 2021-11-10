/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useWallet } from 'use-wallet'
import { Link } from 'react-router-dom'
import {
	Box,
	Button,
	Flex,
	Text,
	InputGroup,
	NumberInput,
	NumberInputField,
	InputRightElement,
	Image,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Spinner,
	useToast,
} from '@chakra-ui/react'
import { ArrowBackIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { ethers } from 'ethers'
import defaults from '../../common/defaults'
import {
	getERC20BalanceOf,
	getERC20Allowance,
	approveERC20ToSpend,
	bond,
} from '../../common/ethereum'
import {
	prettifyNumber,
	getPercentage,
	convertBlocksToDays,
	getTokenPrice,
} from '../../common/utils'
import {
	approved,
	rejected,
	failed,
	walletNotConnected,
	noAmount,
	tokenValueTooSmall,
	exception,
	insufficientBalance,
	bondDeposited,
	bondRedeemed,
	bondNoRewards,
	bondDepositExceedsMaxBondSize,
} from '../../messages'

const Bond = props => {
	const wallet = useWallet()
	const [roi, setRoi] = useState(0)
	const [vestingTerm, setVestingTerm] = useState(0)
	const [debtRatio, setDebtRatio] = useState(0)
	const [bondContract0] = useState(defaults.bondable[0].address)
	const [payoutToken0] = useState(defaults.bondable[0].payoutToken)
	const [principalToken0] = useState(defaults.bondable[0].principalToken)
	const [payoutTokenPrice, setPayoutTokenPrice] = useState(0)
	const [bondPrice0, setBondPrice0] = useState(0)
	const [bondInfo, setBondInfo] = useState({
		redeemableRewards: ethers.BigNumber.from('0'),
		pendingRewards: ethers.BigNumber.from('0'),
		vested: getPercentage(0),
	})
	const [refreshBondInfo, setRefreshBondInfo] = useState(Date.now())

	useEffect(() => {
		if (!wallet.account) return
		const timeoutId = setTimeout(() => {
			setRefreshBondInfo(Date.now())
		}, 5000)
		const provider = new ethers.providers.Web3Provider(wallet.ethereum)
		const iBond = bond(bondContract0, provider)
		// it's actually the number of blocks to vest (from VaderBond contract)
		const MAX_PERCENT_VESTED = 10000
		Promise.all([
			iBond.bondInfo(wallet.account),
			iBond.pendingPayoutFor(wallet.account),
			iBond.percentVestedFor(wallet.account),
		])
			.then(([{ payout: totalPayout }, pendingPayout, percentVested]) => {
				setBondInfo({
					redeemableRewards: pendingPayout,
					pendingRewards: totalPayout.sub(pendingPayout),
					vested: percentVested.div(MAX_PERCENT_VESTED).gte(1)
						? 'Fully Vested'
						: getPercentage(
							percentVested.toNumber() / MAX_PERCENT_VESTED,
							2,
							6,
						  ),
				})
			})
			.catch(console.error)
		return function cleanup() {
			clearTimeout(timeoutId)
		}
	}, [wallet.account, refreshBondInfo])

	useEffect(() => {
		bond(bondContract0, defaults.network.provider)
			.terms()
			.then(data => {
				setVestingTerm(Math.ceil(convertBlocksToDays(data.vestingTerm)))
			})
			.catch(console.error)
	}, [])

	useEffect(() => {
		bond(bondContract0, defaults.network.provider)
			.debtRatio()
			.then(data => {
				setDebtRatio(+ethers.utils.formatEther(data))
			})
			.catch(console.error)
	}, [])

	useEffect(() => {
		Promise.all([
			getTokenPrice(payoutToken0.coingeckoId),
			getTokenPrice(principalToken0.coingeckoId),
			bond(bondContract0, defaults.network.provider).price(),
		]).then(([payoutTokenPriceUsd, principalTokenPriceUsd, bondPrice]) => {
			const bondPriceUsd =
				bondPrice.div(100).toNumber() * principalTokenPriceUsd
			setPayoutTokenPrice(payoutTokenPriceUsd)
			setBondPrice0(bondPriceUsd)
			setRoi((payoutTokenPriceUsd - bondPriceUsd) / bondPriceUsd)
		})
	}, [])

	return (
		<Box
			minH={`calc(100vh - ${defaults.layout.header.minHeight})`}
			maxW="49ch"
			m="0 auto"
			p={{ base: '2.5rem 1.2rem 0', md: '2.5rem 0 0' }}
			{...props}
		>
			<Link to="/bonds">
				<Flex align="center">
					<ArrowBackIcon />
					<Text ml="0.5rem">Bonds</Text>
				</Flex>
			</Link>
			<Flex
				m="1rem auto"
				p="1px"
				flexDir="column"
				height="auto"
				mb="98.4px"
				layerStyle="colorful"
				backgroundImage="linear-gradient(90deg,rgb(100, 71, 101) 0%,rgb(33, 74, 112) 100%)"
			>
				<Flex
					width="100%"
					layerStyle="colorful"
					background="#000000c4;"
					minH="430.4px"
					flexDir="column"
					justifyContent="flex-start"
					position="relative"
				>
					<Tabs isFitted colorScheme="bluish">
						<TabList mb="1rem">
							<Tab
								p="1.5rem 0"
								_focus={{
									boxShadow: '0',
									borderRadius: '24px 0 0 0',
								}}
							>
								<Text as="h3" m="0" fontSize="1.24rem">
									Bond
								</Text>
							</Tab>
							<Tab
								p="1.5rem 0"
								_focus={{
									boxShadow: '0',
									borderRadius: '0 24px 0 0',
								}}
							>
								<Text as="h3" m="0" fontSize="1.24rem">
									Redeem
								</Text>
							</Tab>
						</TabList>
						<TabPanels p="0 2.6rem">
							<TabPanel p="0">
								<BondPanel
									vestingTerm={vestingTerm}
									roi={roi}
									refreshBondInfo={setRefreshBondInfo}
									bondPrice={bondPrice0}
									marketPrice={payoutTokenPrice}
								/>
							</TabPanel>
							<TabPanel p="0">
								<RedeemPanel
									vestingTerm={vestingTerm}
									roi={roi}
									debtRatio={debtRatio}
									bondInfo={bondInfo}
									refreshBondInfo={setRefreshBondInfo}
									bondPrice={bondPrice0}
									marketPrice={payoutTokenPrice}
								/>
							</TabPanel>
						</TabPanels>
					</Tabs>
				</Flex>
			</Flex>
		</Box>
	)
}

const BondPanel = props => {
	BondPanel.propTypes = {
		vestingTerm: PropTypes.number,
		roi: PropTypes.number,
		refreshBondInfo: PropTypes.func,
		bondPrice: PropTypes.number,
		marketPrice: PropTypes.number,
	}

	const [inputAmount, setInputAmount] = useState(ethers.BigNumber.from('0'))
	const [value, setValue] = useState(0)
	const [principalBalance, setPrincipalBalance] = useState(
		ethers.BigNumber.from('0'),
	)
	const [bondContract0] = useState(defaults.bondable[0].address)
	const [principalToken] = useState(defaults.bondable[0].principalToken)
	const [payoutToken] = useState(defaults.bondable[0].payoutToken)
	const [payoutAmount, setPayoutAmount] = useState(ethers.BigNumber.from('0'))
	const [maxBondSize, setMaxBondSize] = useState(ethers.BigNumber.from('0'))
	const [working, setWorking] = useState(false)
	const [accessApproved, setAccessApproved] = useState(false)
	const [refreshDataToken, setRefreshDataToken] = useState(Date.now())
	const wallet = useWallet()
	const toast = useToast()

	useEffect(() => {
		if (wallet.account) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getERC20BalanceOf(principalToken.address, wallet.account, provider)
				.then(data => {
					setPrincipalBalance(data)
				})
				.catch(console.error)
		}
		return () => setPrincipalBalance(ethers.BigNumber.from('0'))
	}, [wallet.account, refreshDataToken])

	useEffect(() => {
		if (wallet.account) {
			setWorking(true)
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getERC20Allowance(
				principalToken.address,
				wallet.account,
				bondContract0,
				provider,
			).then(n => {
				setWorking(false)
				if (n.gt(0)) setAccessApproved(true)
			})
		}
		return () => {
			setWorking(true)
			setAccessApproved(false)
		}
	}, [wallet.account, refreshDataToken])

	useEffect(() => {
		if (!wallet.account) return
		const provider = new ethers.providers.Web3Provider(wallet.ethereum)
		bond(bondContract0, provider)
			.payoutFor(value)
			.then(data => {
				setPayoutAmount(data)
			})
			.catch(console.error)
	}, [wallet.account, value])

	useEffect(() => {
		bond(bondContract0, defaults.network.provider)
			.maxBondSize()
			.then(data => {
				setMaxBondSize(data)
			})
			.catch(console.error)
	}, [])

	const onAmountChange = _amount => {
		if (!_amount) return setAmountByPercentage(0)
		try {
			const _value = ethers.utils.parseUnits(_amount, principalToken.decimals)
			setValue(_value)
			setInputAmount(_amount)
		}
		catch (error) {
			if (error.code === 'NUMERIC_FAULT') {
				toast(tokenValueTooSmall)
			}
		}
	}
	const setAmountByPercentage = multiplier => {
		const _value = principalBalance.div(100).mul(multiplier)
		setValue(_value)
		setInputAmount(ethers.utils.formatUnits(_value, principalToken.decimals))
	}

	const submit = () => {
		if (!working) {
			if (!wallet.account) {
				toast(walletNotConnected)
			}
			else if (!accessApproved) {
				const provider = new ethers.providers.Web3Provider(wallet.ethereum)
				setWorking(true)
				approveERC20ToSpend(
					principalToken.address,
					bondContract0,
					defaults.network.erc20.maxApproval,
					provider,
				)
					.then(tx => {
						tx.wait(defaults.network.tx.confirmations)
							.then(() => {
								setWorking(false)
								setAccessApproved(true)
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
						if (err.code === 'INSUFFICIENT_FUNDS') {
							console.log(
								'Insufficient balance: Your account balance is insufficient.',
							)
							toast(insufficientBalance)
						}
						else if (err.code === 4001) {
							console.log(
								'Transaction rejected: Your have decided to reject the transaction..',
							)
							toast(rejected)
						}
						else {
							console.log(err)
							toast(failed)
						}
					})
			}
			else if (value > 0) {
				if (maxBondSize.gte(payoutAmount)) {
					if (principalBalance.gte(value)) {
						const provider = new ethers.providers.Web3Provider(wallet.ethereum)
						setWorking(true)
						bond(bondContract0, provider.getSigner(0))
							.deposit(value, wallet.account)
							.then(tx => {
								tx.wait(defaults.network.tx.confirmations).then(r => {
									setWorking(false)
									setRefreshDataToken(Date.now())
									props.refreshBondInfo(Date.now())
									toast({
										...bondDeposited,
										description: (
											<a
												_focus={{
													boxShadow: '0',
												}}
												href={`${defaults.api.etherscanUrl}tx/${r.transactionHash}`}
												target="_blank"
												rel="noreferrer"
											>
												<Box>
													Click here to view transaction on{' '}
													<i>
														<b>Etherscan</b>
													</i>
													.
												</Box>
											</a>
										),
										duration: defaults.toast.txHashDuration,
									})
								})
							})
							.catch(err => {
								setWorking(false)
								if (err.code === 4001) {
									toast(rejected)
								}
								else if (err.code === -32016) {
									toast(exception)
								}
								else {
									toast(failed)
								}
							})
					}
					else {
						toast(insufficientBalance)
					}
				}
				else {
					toast(bondDepositExceedsMaxBondSize)
				}
			}
			else {
				toast(noAmount)
			}
		}
	}

	return (
		<Flex
			width="100%"
			p="1.5rem 0 2.5rem"
			flexDir="column"
			justifyContent="flex-start"
			position="relative"
		>
			<Text textAlign="center" as="h3" fontSize="1.25rem" fontWeight="bold">
				{principalToken.symbol} Bond
			</Text>
			<Flex justifyContent="space-around" mt="1.5rem">
				<Box textAlign="center">
					<Text fontSize="0.9rem">Bond Price</Text>
					<Text fontWeight="semibold">
						${prettifyNumber(props.bondPrice, 2, 5)}
					</Text>
				</Box>
				<Box textAlign="center">
					<Text fontSize="0.9rem">Market Price</Text>
					<Text fontWeight="semibold">
						${prettifyNumber(props.marketPrice, 2, 5)}
					</Text>
				</Box>
			</Flex>
			<Flex mt="2rem" flexDir="column">
				<Flex alignItems="center" justifyContent="space-between">
					<Text as="h4" fontSize="1.24rem" fontWeight="bolder">
						Amount
					</Text>
				</Flex>
				<Flex layerStyle="inputLike">
					<InputGroup>
						<NumberInput
							variant="transparent"
							flex="1"
							value={inputAmount}
							onChange={onAmountChange}
						>
							<NumberInputField
								placeholder="0"
								fontSize="1.3rem"
								fontWeight="bold"
							/>
						</NumberInput>
						<InputRightElement width="auto">
							<Flex cursor="default" zIndex="1">
								<Box d="flex" alignItems="center">
									<Image
										width="24px"
										height="24px"
										mr="10px"
										src={principalToken.logoURI}
									/>
									<Box
										as="h3"
										m="0"
										fontSize="1.02rem"
										fontWeight="bold"
										textTransform="capitalize"
									>
										{principalToken.symbol}
									</Box>
								</Box>
							</Flex>
						</InputRightElement>
					</InputGroup>
				</Flex>
				<Flex mt=".6rem" justifyContent="flex-end" flexDir="row">
					<Button
						variant="outline"
						size="sm"
						mr="0.4rem"
						onClick={() => setAmountByPercentage(25)}
					>
						25%
					</Button>
					<Button
						variant="outline"
						size="sm"
						mr="0.4rem"
						onClick={() => setAmountByPercentage(50)}
					>
						50%
					</Button>
					<Button
						variant="outline"
						size="sm"
						mr="0.4rem"
						onClick={() => setAmountByPercentage(75)}
					>
						75%
					</Button>
					<Button
						variant="outline"
						size="sm"
						mr="0.4rem"
						onClick={() => setAmountByPercentage(100)}
					>
						MAX
					</Button>
				</Flex>
				<Flex mt="2rem" justifyContent="center">
					<Button
						minWidth="230px"
						size="lg"
						variant="solidRadial"
						onClick={submit}
						disabled={working}
					>
						<Text fontWeight="bold" as="div">
							{wallet.account && (
								<>
									{!working && (
										<>
											{!accessApproved && <>Approve {principalToken.symbol}</>}
											{accessApproved && <>Bond</>}
										</>
									)}
									{working && (
										<>
											<Spinner />
										</>
									)}
								</>
							)}
							{!wallet.account && <>Bond</>}
						</Text>
					</Button>
				</Flex>
			</Flex>
			<Box mt="3rem">
				<Flex justifyContent="space-between">
					<Text>Your Balance</Text>
					<Text>
						{prettifyNumber(
							ethers.utils.formatUnits(
								principalBalance,
								principalToken.decimals,
							),
							0,
							5,
						)}{' '}
						{principalToken.symbol}
					</Text>
				</Flex>
				<Flex justifyContent="space-between" mt="0.25rem">
					<Text>You Will Get</Text>
					<Text>
						{prettifyNumber(
							ethers.utils.formatUnits(payoutAmount, payoutToken.decimals),
							0,
							5,
						)}{' '}
						{payoutToken.symbol}
					</Text>
				</Flex>
				<Flex justifyContent="space-between" mt="0.25rem">
					<Text>Max You Can Buy</Text>
					<Text>
						{prettifyNumber(
							ethers.utils.formatUnits(maxBondSize, payoutToken.decimals),
							0,
							5,
						)}{' '}
						{payoutToken.symbol}
					</Text>
				</Flex>
				<Flex justifyContent="space-between" mt="0.25rem">
					<Text>ROI</Text>
					<Text>{getPercentage(props.roi)}</Text>
				</Flex>
				<Flex justifyContent="space-between" mt="0.25rem">
					<Text>Vesting Term</Text>
					<Text>{props.vestingTerm} Days</Text>
				</Flex>
				<Flex justifyContent="space-between" mt="0.25rem">
					<Text>Bond Contract</Text>
					<Link
						to={{ pathname: defaults.api.etherscanUrl + bondContract0 }}
						target="_blank"
					>
						<Flex align="center">
							<Text mr="0.5rem">View</Text>
							<ExternalLinkIcon />
						</Flex>
					</Link>
				</Flex>
			</Box>
		</Flex>
	)
}

const RedeemPanel = props => {
	RedeemPanel.propTypes = {
		vestingTerm: PropTypes.number,
		roi: PropTypes.number,
		debtRatio: PropTypes.number,
		bondInfo: PropTypes.object,
		refreshBondInfo: PropTypes.func,
		bondPrice: PropTypes.number,
		marketPrice: PropTypes.number,
	}

	const wallet = useWallet()
	const toast = useToast()
	const [bondContract0] = useState(defaults.bondable[0].address)
	const [principalToken] = useState(defaults.bondable[0].principalToken)
	const [payoutToken] = useState(defaults.bondable[0].payoutToken)
	const [working, setWorking] = useState(false)

	// eslint-disable-next-line no-empty-function
	const submit = () => {
		if (!working) {
			if (!wallet.account) {
				toast(walletNotConnected)
			}
			else if (props.bondInfo.redeemableRewards.gt(0)) {
				const provider = new ethers.providers.Web3Provider(wallet.ethereum)
				setWorking(true)
				bond(bondContract0, provider.getSigner(0))
					.redeem(wallet.account)
					.then(tx => {
						tx.wait(defaults.network.tx.confirmations).then(r => {
							setWorking(false)
							props.refreshBondInfo(Date.now())
							toast({
								...bondRedeemed,
								description: (
									<a
										_focus={{
											boxShadow: '0',
										}}
										href={`${defaults.api.etherscanUrl}tx/${r.transactionHash}`}
										target="_blank"
										rel="noreferrer"
									>
										<Box>
											Click here to view transaction on{' '}
											<i>
												<b>Etherscan</b>
											</i>
											.
										</Box>
									</a>
								),
								duration: defaults.toast.txHashDuration,
							})
						})
					})
					.catch(err => {
						setWorking(false)
						if (err.code === 4001) {
							toast(rejected)
						}
						else if (err.code === -32016) {
							toast(exception)
						}
						else {
							toast(failed)
						}
					})
			}
			else {
				toast(bondNoRewards)
			}
		}
	}

	return (
		<Flex
			width="100%"
			p="1.5rem 0 2.5rem"
			flexDir="column"
			justifyContent="flex-start"
			position="relative"
		>
			<Text textAlign="center" as="h3" fontSize="1.25rem" fontWeight="bold">
				{principalToken.symbol} Bond
			</Text>
			<Flex justifyContent="space-around" mt="1.5rem">
				<Box textAlign="center">
					<Text fontSize="0.9rem">Bond Price</Text>
					<Text fontWeight="semibold">
						${prettifyNumber(props.bondPrice, 2, 5)}
					</Text>
				</Box>
				<Box textAlign="center">
					<Text fontSize="0.9rem">Market Price</Text>
					<Text fontWeight="semibold">
						${prettifyNumber(props.marketPrice, 2, 5)}
					</Text>
				</Box>
			</Flex>
			<Flex mt="2rem" justifyContent="center">
				<Button
					minWidth="230px"
					size="lg"
					variant="solidRadial"
					onClick={submit}
					disabled={working}
				>
					<Text fontWeight="bold" as="div">
						{wallet.account && (
							<>
								{!working && <>Redeem</>}
								{working && (
									<>
										<Spinner />
									</>
								)}
							</>
						)}
						{!wallet.account && <>Redeem</>}
					</Text>
				</Button>
			</Flex>
			<Box mt="3rem">
				<Flex justifyContent="space-between">
					<Text>Redeemable Rewards</Text>
					<Text>
						{prettifyNumber(
							ethers.utils.formatUnits(
								props.bondInfo.redeemableRewards,
								payoutToken.decimals,
							),
							0,
							5,
						)}{' '}
						{payoutToken.symbol}
					</Text>
				</Flex>
				<Flex justifyContent="space-between" mt="0.25rem">
					<Text>Pending Rewards</Text>
					<Text>
						{prettifyNumber(
							ethers.utils.formatUnits(
								props.bondInfo.pendingRewards,
								payoutToken.decimals,
							),
							0,
							5,
						)}{' '}
						{payoutToken.symbol}
					</Text>
				</Flex>
				<Flex justifyContent="space-between" mt="0.25rem">
					<Text>Vested</Text>
					<Text>{props.bondInfo.vested}</Text>
				</Flex>
				<Flex justifyContent="space-between" mt="0.25rem">
					<Text>ROI</Text>
					<Text>{getPercentage(props.roi)}</Text>
				</Flex>
				<Flex justifyContent="space-between" mt="0.25rem">
					<Text>Debt Ratio</Text>
					<Text>{getPercentage(props.debtRatio)}</Text>
				</Flex>
				<Flex justifyContent="space-between" mt="0.25rem">
					<Text>Vesting Term</Text>
					<Text>{props.vestingTerm} Days</Text>
				</Flex>
			</Box>
		</Flex>
	)
}

export default Bond
