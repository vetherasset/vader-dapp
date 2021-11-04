/* eslint-disable brace-style */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
	Box,
	Button,
	Flex,
	Text,
	Tab,
	TabList,
	Tabs,
	TabPanels,
	TabPanel,
	NumberInput,
	NumberInputField,
	InputGroup,
	InputRightElement,
	useToast,
} from '@chakra-ui/react'
import defaults from '../common/defaults'
import { useWallet } from 'use-wallet'
import { ethers } from 'ethers'
import {
	getERC20BalanceOf,
	getERC20Allowance,
	getVaderPerXVader,
	approveERC20ToSpend,
	stakeVader,
	unstakeVader,
} from '../common/ethereum'
import {
	approved,
	rejected,
	failed,
	walletNotConnected,
	noAmount,
	staked,
	unstaked,
} from '../messages'
import { prettifyNumber } from '../common/utils'
const Stake = props => {
	const wallet = useWallet()
	const [accessApproved, setAccessApproved] = useState(false)
	const [vdrBalance, setVdrBalance] = useState(0)
	const [xvdrBalance, setXvdrBalance] = useState(0)
	const [xvdrExchangeRate, setXvdrExchangeRate] = useState(1)
	const [refreshDataToken, setRefreshDataToken] = useState(Date.now())

	useEffect(() => {
		if (wallet.ethereum) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getVaderPerXVader(provider)
				.then(data => {
					setXvdrExchangeRate(data.toNumber())
				})
				.catch(console.error)
		}
	}, [wallet.ethereum, refreshDataToken])

	useEffect(() => {
		if (wallet.account) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getERC20Allowance(
				defaults.address.fakeVader,
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
			getERC20BalanceOf(defaults.address.fakeVader, wallet.account, provider)
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
			maxWidth={defaults.layout.container.md.width}
			m="0 auto"
			p={{ base: '5rem 1.2rem 0', md: '5rem 0 0' }}
			{...props}
		>
			<Flex m="0 auto" flexDir="row" height="auto">
				<Box width="67%">
					<Flex
						p="1.8rem"
						flexDir="row"
						height="auto"
						layerStyle="colorful"
						backgroundImage="linear-gradient(90deg,rgb(100, 71, 101) 0%,rgb(33, 74, 112) 100%)"
						alignItems="center"
						justifyContent="space-between"
					>
						<Text fontSize="1.2rem" fontWeight="bolder">
							APY
						</Text>
						<Text fontSize="1.5rem" fontWeight="bolder">
							0.0%
						</Text>
					</Flex>
					<Flex
						mt="1.5rem"
						p="1.8rem"
						flexDir="column"
						height="auto"
						layerStyle="colorful"
						backgroundImage="linear-gradient(90deg,rgb(100, 71, 101) 0%,rgb(33, 74, 112) 100%)"
					>
						<Tabs isFitted variant="enclosed">
							<TabList mb="1rem">
								<Tab>
									<Text fontSize="1.25rem" fontWeight="medium">
										Stake
									</Text>
								</Tab>
								<Tab>
									<Text fontSize="1.25rem" fontWeight="medium">
										Unstake
									</Text>
								</Tab>
							</TabList>
							<TabPanels>
								<TabPanel>
									<StakePanel
										exchangeRate={xvdrExchangeRate}
										accessApproved={accessApproved}
										balance={vdrBalance}
										refreshData={setRefreshDataToken}
									/>
								</TabPanel>
								<TabPanel>
									<UnstakePanel
										exchangeRate={xvdrExchangeRate}
										balance={xvdrBalance}
										refreshData={setRefreshDataToken}
									/>
								</TabPanel>
							</TabPanels>
						</Tabs>
					</Flex>
				</Box>
				<Box ml="1.5rem" flex="1">
					<Box
						p="1.8rem"
						layerStyle="colorful"
						backgroundImage="linear-gradient(90deg,rgb(100, 71, 101) 0%,rgb(33, 74, 112) 100%)"
					>
						<Text fontSize="1.2rem" fontWeight="bolder">
							Balance
						</Text>
						<Text fontSize="1.5rem" fontWeight="bolder" mt="1rem">
							{prettifyNumber(vdrBalance, 2, 6)} VDR
						</Text>
						<Text fontSize="1.5rem" fontWeight="bolder" mt="0.5rem">
							{prettifyNumber(xvdrBalance, 2, 6)} xVDR
						</Text>
					</Box>
				</Box>
			</Flex>
		</Box>
	)
}

const ExchangeRate = props => {
	return <Text>1 xVDR = {prettifyNumber(props.rate, 2, 6)} VDR</Text>
}
ExchangeRate.propTypes = {
	rate: PropTypes.number.isRequired,
}

const StakePanel = props => {
	const [amount, setAmount] = useState('')
	const [processingTxStatus, setProcessingTxStatus] = useState(false)

	const wallet = useWallet()
	const toast = useToast()
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
			defaults.address.fakeVader,
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
				} else {
					return toast(failed)
				}
			})
		} catch (error) {
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
		if (props.accessApproved) {
			return stake(provider)
		}
		try {
			const ret = await approveAccess(provider)
			provider.once(ret.hash, tx => {
				if (tx.status === 1) {
					toast(approved)
					props.refreshData(Date.now())
					return stake(provider)
				} else {
					setProcessingTxStatus(false)
					return toast(failed)
				}
			})
		} catch (error) {
			console.error(error)
			setProcessingTxStatus(false)
			if (error.code === 4001) {
				return toast(rejected)
			}
			toast(failed)
		}
	}
	return (
		<Box>
			<Flex alignItems="center" justifyContent="space-between">
				<Text align="center" fontSize="1.55rem" fontWeight="bolder">
					Stake VDR
				</Text>
				<ExchangeRate rate={props.exchangeRate} />
			</Flex>
			<Flex mt="1rem" layerStyle="inputLike">
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
					<InputRightElement>
						<Button h="1.75rem" size="sm" onClick={setMaxAmount}>
							Max
						</Button>
					</InputRightElement>
				</InputGroup>
			</Flex>
			<Flex mt="2rem" justifyContent="center">
				<Button
					minWidth="230px"
					size="lg"
					variant="solidRadial"
					onClick={submit}
					disabled={processingTxStatus}
				>
					<Text fontWeight="bold">
						{processingTxStatus
							? 'PROCESSING TRANSACTION'
							: props.accessApproved || !wallet.account
								? 'STAKE'
								: 'APPROVE ACCESS'}
					</Text>
				</Button>
			</Flex>
		</Box>
	)
}
StakePanel.propTypes = {
	exchangeRate: PropTypes.number.isRequired,
	accessApproved: PropTypes.bool.isRequired,
	balance: PropTypes.number.isRequired,
	refreshData: PropTypes.func,
}

const UnstakePanel = props => {
	const [amount, setAmount] = useState('')
	const [processingTxStatus, setProcessingTxStatus] = useState(false)
	const wallet = useWallet()
	const toast = useToast()

	const setMaxAmount = () => {
		setAmount(props.balance)
	}
	const handleChange = value => {
		if (value > props.balance) {
			value = props.balance
		}
		setAmount(value)
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
			const ret = await unstakeVader(
				ethers.utils.parseEther(String(amount)),
				provider,
			)
			provider.once(ret.hash, tx => {
				setProcessingTxStatus(false)
				if (tx.status === 1) {
					props.refreshData(Date.now())
					setAmount(0)
					return toast(unstaked)
				} else {
					return toast(failed)
				}
			})
		} catch (error) {
			console.error(error)
			setProcessingTxStatus(false)
			if (error.code === 4001) {
				return toast(rejected)
			}
			toast(failed)
		}
	}
	return (
		<Box>
			<Flex alignItems="center" justifyContent="space-between">
				<Text align="center" fontSize="1.55rem" fontWeight="bolder">
					Unstake xVDR
				</Text>
				<ExchangeRate rate={props.exchangeRate} />
			</Flex>
			<Flex mt="1rem" layerStyle="inputLike">
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
					<InputRightElement>
						<Button h="1.75rem" size="sm" onClick={setMaxAmount}>
							Max
						</Button>
					</InputRightElement>
				</InputGroup>
			</Flex>
			<Flex mt="2rem" justifyContent="center">
				<Button
					minWidth="230px"
					size="lg"
					variant="solidRadial"
					onClick={submit}
					disabled={processingTxStatus}
				>
					<Text fontWeight="bold">
						{processingTxStatus ? 'PROCESSING TRANSACTION' : 'UNSTAKE'}
					</Text>
				</Button>
			</Flex>
		</Box>
	)
}
UnstakePanel.propTypes = {
	exchangeRate: PropTypes.number.isRequired,
	balance: PropTypes.number.isRequired,
	refreshData: PropTypes.func,
}

export default Stake
