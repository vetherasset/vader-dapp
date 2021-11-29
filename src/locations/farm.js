import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
	Box, Button, Flex, Text, Tab, TabList, Tabs, TabPanels, TabPanel,
	InputGroup, Image, Container, Heading, Badge, Link, useToast, Spinner,
	Input, InputRightAddon,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useWallet } from 'use-wallet'
import { ethers } from 'ethers'
import { getERC20Allowance, approveERC20ToSpend, lpTokenStaking, getERC20BalanceOf } from '../common/ethereum'
import defaults from '../common/defaults'
import { prettifyNumber, secondsToStringDuration, getPercentage } from '../common/utils'
import {
	approved, rejected, failed, walletNotConnected, noAmount, lpTokenStaked,
	lpTokenUnstaked, lpTokenClaimed, tokenValueTooSmall, exception, insufficientBalance,
} from '../messages'
import { calculateLPTokenAPR } from '../common/calculation'

const getLPToken = (pairTokens) => pairTokens.map(tk => tk.symbol).join('-')

const Farm = props => {
	return (
		<Box
			height={`calc(120vh - ${defaults.layout.header.minHeight})`}
			maxWidth={defaults.layout.container.lg.width}
			m='0 auto'
			p={{ base: '5rem 1.2rem 0', md: '5rem 0 0' }}
			{...props}
		>
			<Accordion allowToggle>
				{
					defaults.lpStakingTokens.map(token=> {
						return (
							<AccordionItem key={token.tokenContractAddress}>
    						{({ isExpanded }) => (
									<LPStakingItem isExpanded={isExpanded} token={token}></LPStakingItem>
								)}
							</AccordionItem>
						)
					})
				}
			</Accordion>
		</Box>
	)
}

const LPStakingItem = (props) => {
	LPStakingItem.propTypes = {
		token: PropTypes.object.isRequired,
		isExpanded: PropTypes.bool.isRequired,
	}
	const { token, isExpanded } = props
	const lpToken = getLPToken(token.pairTokens)
	const wallet = useWallet()
	const [availableTokenBalance, setAvailableTokenBalance] = useState(ethers.BigNumber.from('0'))
	const [stakingTokenBalance, setStakingTokenBalance] = useState(ethers.BigNumber.from('0'))
	const [rewardTokenBalance, setRewardTokenBalance] = useState(ethers.BigNumber.from('0'))
	const [refreshDataToken, setRefreshDataToken] = useState(Date.now())

	useEffect(() => {
		if (isExpanded && wallet.account) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getERC20BalanceOf(
				token.tokenContractAddress,
				wallet.account,
				provider,
			)
				.then(data => {
					setAvailableTokenBalance(data)
				})
				.catch(console.error)
		}
		return () => setAvailableTokenBalance(ethers.BigNumber.from('0'))
	}, [wallet.account, refreshDataToken])

	useEffect(() => {
		if (isExpanded && wallet.account) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			const stakingContract = lpTokenStaking(token.stakingContractAddress, provider)
			stakingContract.balanceOf(
				wallet.account,
			)
				.then(data => {
					setStakingTokenBalance(data)
				})
				.catch(console.error)
		}
		return () => setStakingTokenBalance(ethers.BigNumber.from('0'))
	}, [wallet.account, refreshDataToken])

	useEffect(() => {
		if (isExpanded && wallet.account) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			const stakingContract = lpTokenStaking(token.stakingContractAddress, provider)
			stakingContract.earned(
				wallet.account,
			)
				.then(data => {
					setRewardTokenBalance(data)
				})
				.catch(console.error)
		}
		return () => setRewardTokenBalance(ethers.BigNumber.from('0'))
	}, [wallet.account, refreshDataToken])

	return (
		<>
			<h2>
				<AccordionButton _expanded={{ bg: 'rgb(131, 90, 129)', color: '#fff' }}>
					<Box flex="1" textAlign="left" color="white" fontWeight='bolder'>
						<Image
							width='23px'
							height='23px'
							borderRadius='50%'
							objectFit='none'
							background='#fff'
							mr='3px'
							float='left'
							src={token.pairTokens[0].logoURI}
						/>
						<Image
							width='23px'
							height='23px'
							borderRadius='50%'
							objectFit='none'
							background='#fff'
							mr='5px'
							float='left'
							src={token.pairTokens[1].logoURI}
						/>
						{lpToken} LP
					</Box>
					<AccordionIcon />
				</AccordionButton>
			</h2>
			<AccordionPanel pb={4}>
				<Flex>
					<Flex
						flexDir='column'
						w='100%'
						paddingRight='2rem'
						justifyContent='center'
					>
						<DetailSection
							token={token}
							availableTokenBalance={availableTokenBalance}
							stakingTokenBalance={stakingTokenBalance}
							rewardTokenBalance={rewardTokenBalance}
							setRefreshDataToken={setRefreshDataToken}
						></DetailSection>
					</Flex>
					<Flex
						w='77.777%'
						minH='478.65px'
						m='0 auto'
						p='0 0 2rem'
						layerStyle='colorful'
						flexDir='column'
					>
						<StakingSection
							availableTokenBalance={availableTokenBalance}
							stakingTokenBalance={stakingTokenBalance}
							rewardTokenBalance={rewardTokenBalance}
							token={token}
							setRefreshDataToken={setRefreshDataToken}
						></StakingSection>
					</Flex>
				</Flex>
			</AccordionPanel>
		</>
	)
}
const StakingSection = (props) => {
	StakingSection.propTypes = {
		availableTokenBalance: PropTypes.object.isRequired,
		stakingTokenBalance: PropTypes.object.isRequired,
		rewardTokenBalance: PropTypes.object.isRequired,
		token: PropTypes.object.isRequired,
		setRefreshDataToken: PropTypes.func,
	}
	return (
		<>
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
					<Tab p='1.5rem 0' _focus={{
						boxShadow: '0',
						borderRadius: '0 24px 0 0',
					}}>
						<Text as='h3' m='0' fontSize='1.24rem'>
						Claim
						</Text>
					</Tab>
				</TabList>
				<TabPanels
					p='0 2.6rem'
				>
					<TabPanel p='0'>
						<StakePanel
							availableTokenBalance={props.availableTokenBalance}
							token={props.token}
							refreshData={props.setRefreshDataToken}
						/>
					</TabPanel>
					<TabPanel p='0'>
						<UnstakePanel
							stakingTokenBalance={props.stakingTokenBalance}
							token={props.token}
							refreshData={props.setRefreshDataToken}
						/>
					</TabPanel>
					<TabPanel p='0'>
						<ClaimPanel
							rewardTokenBalance={props.rewardTokenBalance}
							token={props.token}
							refreshData={props.setRefreshDataToken}
						/>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</>
	)
}

const LPTokenIcon = (props) => {
	LPTokenIcon.propTypes = {
		logoURI1: PropTypes.string.isRequired,
		logoURI2: PropTypes.string.isRequired,
	}
	return (
		<>
			<Image
				width='24px'
				height='24px'
				float='left'
				src={props.logoURI1}
			/>
			<Image
				width='24px'
				height='24px'
				float='left'
				ml='-5px'
				src={props.logoURI2}
			/>
		</>
	)
}

const LPTokenIconAndSymbol = (props) => {
	LPTokenIconAndSymbol.propTypes = {
		lpToken: PropTypes.string.isRequired,
		logoURI1: PropTypes.string.isRequired,
		logoURI2: PropTypes.string.isRequired,
	}
	return (
		<>
			<LPTokenIcon
				logoURI1={props.logoURI1}
				logoURI2={props.logoURI2}
			></LPTokenIcon>
			<Box
				as='h3'
				m='0'
				ml='3px'
				fontSize='1.02rem'
				fontWeight='bold'
			>{props.lpToken} LP</Box>
		</>
	)
}

const DetailSection = (props) => {
	DetailSection.propTypes = {
		token: PropTypes.object.isRequired,
		availableTokenBalance: PropTypes.object.isRequired,
		stakingTokenBalance: PropTypes.object.isRequired,
		rewardTokenBalance: PropTypes.object.isRequired,
	}
	const lpToken = props.token.pairTokens.map(tk => tk.symbol).join('-')
	const rewardToken = props.token.rewardToken
	const [rewardsDistribution, setRewardsDistribution] = useState(ethers.BigNumber.from('0'))
	const [rewardsDurationStr, setRewardsDurationStr] = useState('')
	const [apr, setAPR] = useState(0)

	useEffect(async () => {
		const stakingContract = lpTokenStaking(props.token.stakingContractAddress)
		const [rewardRate, rewardsDuration] = await Promise.all([
			stakingContract.rewardRate(),
			stakingContract.rewardsDuration(),
		]).catch(console.error)
		const rewards = ethers.BigNumber.from(rewardRate).mul(rewardsDuration)
		setRewardsDistribution(rewards)
		setRewardsDurationStr(secondsToStringDuration(rewardsDuration))
	}, [])

	useEffect(() => {
		calculateLPTokenAPR(props.token)
			.then(data => {
				setAPR(data)
			})
			.catch(console.error)
	}, [])

	return (
		<>
			<Flex>
				<Container mb='23px' p='0'>
					<Heading as='h1' size='md'>EARN ADDITIONAL {rewardToken.symbol}.</Heading>
					<Box as='p' mb='0.65rem'>Stake your <strong>{lpToken}</strong> for <strong>{rewardToken.symbol}</strong> and maximize your yield. No&nbsp;Impermanent Loss.</Box>
					<Box as='p' mb='23px'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur consequat hendrerit lorem, euismod scelerisque leo sodales eu. </Box>
					<Heading as='h1' size='md'>GET {lpToken}</Heading>
					<Link href={props.token.externalLink} isExternal>
						{props.token.externalText} <ExternalLinkIcon mx="2px" />
					</Link>
				</Container>
			</Flex>
			<Flex>
				<Container p='0'>
					<Box textAlign='left'>
						<Badge
							fontSize='1rem'
							colorScheme='accent'
						>APR</Badge>
					</Box>
					<Box fontSize={{ base: '1.3rem', md: '2.3rem', lg: '2.3rem' }} lineHeight='1.2' fontWeight='normal' mb='19px' textAlign='left'>
						{
							apr ?
								<> {getPercentage(apr)} </> :
								<>--</>
						}
					</Box>
				</Container>
				<Container p='0'>
					<Box textAlign='left'>
						<Badge
							fontSize='1rem'
							colorScheme='accent'
						>REWARD DISTRIBUTION</Badge>
					</Box>
					<Box fontSize={{ base: '1.3rem', md: '2.3rem', lg: '2.3rem' }} lineHeight='1.2' float='left'>
						{
							rewardsDistribution.gt(0) ?
								prettifyNumber(
									ethers.utils.formatUnits(
										rewardsDistribution,
										props.token.rewardToken.decimal,
									),
									0,
									5) :
								0
						}
					</Box>
					<Box mt='10px'>
						<Image
							width='24px'
							height='24px'
							mr='0px'
							float='left'
							src={rewardToken.logoURI}
						/>
						<Text fontWeight='bold'>{rewardToken.symbol} / {rewardsDurationStr}</Text>
					</Box>
				</Container>
			</Flex>
			<Flex>
				<Container p='0' pb='8px'>
					AVAILABLE IN WALLET
				</Container>
				<Container p='0'>
					<Box textAlign='left'>
						<Box float='left' mr='5px' fontWeight='bold'>
							{
								props.availableTokenBalance.gt(0) ?
									prettifyNumber(
										ethers.utils.formatUnits(
											props.availableTokenBalance,
											props.token.tokenDecimal,
										),
										0,
										5) :
									0
							}
						</Box>
						<LPTokenIconAndSymbol
							float='left'
							logoURI1={props.token.pairTokens[0].logoURI}
							logoURI2={props.token.pairTokens[1].logoURI}
							lpToken={lpToken}
						></LPTokenIconAndSymbol>
					</Box>
				</Container>
			</Flex>
			<Flex>
				<Container p='0' pb='8px'>
					TOTAL STAKED
				</Container>
				<Container p='0'>
					<Box float='left' mr='5px' fontWeight='bold'>
						{
							props.stakingTokenBalance.gt(0) ?
								prettifyNumber(
									ethers.utils.formatUnits(
										props.stakingTokenBalance,
										props.token.tokenDecimal,
									),
									0,
									5) :
								0
						}
					</Box>
					<LPTokenIconAndSymbol
						float='left'
						logoURI1={props.token.pairTokens[0].logoURI}
						logoURI2={props.token.pairTokens[1].logoURI}
						lpToken={lpToken}
					></LPTokenIconAndSymbol>
				</Container>
			</Flex>
			<Flex>
				<Container p='0' mb='8px'>
					CLAIMABLE REWARDS
				</Container>
				<Container p='0'>
					<Box>
						<Box float='left' mr='5px' fontWeight='bold'>
							{
								props.rewardTokenBalance.gt(0) ?
									prettifyNumber(
										ethers.utils.formatUnits(
											props.rewardTokenBalance,
											props.token.rewardToken.decimal,
										),
										0,
										5) :
									0
							}
						</Box>
						<Image
							width='24px'
							height='24px'
							mr='0px'
							float='left'
							src={rewardToken.logoURI}
						/>
						<Text fontWeight='bold'>{rewardToken.symbol}</Text>
					</Box>
				</Container>
			</Flex>
		</>
	)
}

const StakePanel = (props) => {
	StakePanel.propTypes = {
		availableTokenBalance: PropTypes.object.isRequired,
		token: PropTypes.object.isRequired,
		refreshData: PropTypes.func,
	}
	const lpToken = getLPToken(props.token.pairTokens)
	const wallet = useWallet()
	const toast = useToast()
	const [value, setValue] = useState(0)
	const [inputAmount, setInputAmount] = useState('')
	const [tokenApproved, setTokenApproved] = useState(false)
	const [working, setWorking] = useState(false)
	const handleAmountChange = (balance, percentage) => () => {
		const newAmount = balance.div(100).mul(percentage)
		setInputAmount(
			ethers.utils.formatUnits(newAmount, props.token.tokenDecimal),
		)
		setValue(newAmount)
	}
	const submit = () => {
		if (!working) {
			if (!wallet.account) {
				toast(walletNotConnected)
			}
			else if (!tokenApproved) {
				const provider = new ethers.providers.Web3Provider(wallet.ethereum)
				setWorking(true)
				approveERC20ToSpend(
					props.token.tokenContractAddress,
					props.token.stakingContractAddress,
					defaults.network.erc20.maxApproval,
					provider,
				).then((tx) => {
					tx.wait(defaults.network.tx.confirmations)
						.then(() => {
							setWorking(false)
							setTokenApproved(true)
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
							console.log('Insufficient balance: Your account balance is insufficient.')
							toast(insufficientBalance)
						}
						else if (err.code === 4001) {
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
				if ((props.availableTokenBalance.gte(value))) {
					const provider = new ethers.providers.Web3Provider(wallet.ethereum)
					const lpStaking = lpTokenStaking(props.token.stakingContractAddress, provider)
					setWorking(true)
					lpStaking.stake(
						value,
					)
						.then((tx) => {
							tx.wait(
								defaults.network.tx.confirmations,
							).then((r) => {
								setWorking(false)
								props.refreshData(Date.now())
								toast({
									...lpTokenStaked,
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
							else if (err.code === -32016) {
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
		if (wallet.account) {
			setWorking(true)
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getERC20Allowance(
				props.token.tokenContractAddress,
				wallet.account,
				props.token.stakingContractAddress,
				provider,
			).then((n) => {
				setWorking(false)
				if (n.gt(0)) setTokenApproved(true)
			})
		}
		return () => {
			setWorking(true)
			setTokenApproved(false)
		}
	}, [wallet.account])
	return (
		<>
			<Flex
				mt='4.2rem'
				flexDir='column'>
				<Flex alignItems="center" justifyContent="space-between">
					<Text as='h4' fontSize='1.24rem' fontWeight='bolder'>Amount</Text>
					<Text as='h4' fontSize='1.24rem' fontWeight='bolder'>{
						props.availableTokenBalance.gt(0) ?
							prettifyNumber(
								ethers.utils.formatUnits(
									props.availableTokenBalance,
									props.token.tokenDecimal,
								),
								0,
								5) :
							0
					}</Text>
				</Flex>
				<Flex
					layerStyle='inputLike'
				>
					<InputGroup>
						<Input
							variant="transparent"
							flex="1"
							fontSize='1.3rem'
							fontWeight='bold'
							placeholder='0.0'
							value={inputAmount}
							onChange={(e) => {
								console.log('e', e)
								if (isNaN(e.target.value)) {
									setInputAmount(prev => prev)
								}
								else {
									setInputAmount(String(e.target.value))
									if(Number(e.target.value) > 0) {
										try {
											setValue(ethers.utils.parseUnits(String(e.target.value), props.token.tokenDecimal))
										}
										catch(err) {
											if (err.code === 'NUMERIC_FAULT') {
												toast(tokenValueTooSmall)
											}
										}
									}
								}
							}}
						>
						</Input>
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
									<LPTokenIconAndSymbol
										float='left'
										logoURI1={props.token.pairTokens[0].logoURI}
										logoURI2={props.token.pairTokens[1].logoURI}
										lpToken={lpToken}
									></LPTokenIconAndSymbol>
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
						onClick={handleAmountChange(props.availableTokenBalance, 100)}>
						MAX
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={handleAmountChange(props.availableTokenBalance, 25)}>
						25%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={handleAmountChange(props.availableTokenBalance, 50)}>
						50%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={handleAmountChange(props.availableTokenBalance, 75)}>
						75%
					</Button>
				</Flex>
				<Flex mt='5.05rem' justifyContent='center'>
					<Button
						minWidth="230px"
						size="lg"
						variant="solidRadial"
						onClick={submit}
						disabled={working}
					>
						<Text fontWeight="bold">
							{wallet.account &&
								<>
									{!working &&
										<>
											{
												!tokenApproved ?
													<>
														Approve {lpToken}
													</> :
													<>Stake</>
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
		stakingTokenBalance: PropTypes.object.isRequired,
		token: PropTypes.object.isRequired,
		refreshData: PropTypes.func,
	}
	const wallet = useWallet()
	const toast = useToast()
	const [value, setValue] = useState(0)
	const [inputAmount, setInputAmount] = useState('')
	const lpToken = getLPToken(props.token.pairTokens)
	const [working, setWorking] = useState(false)
	const handleAmountChange = (balance, percentage) => () => {
		const newAmount = balance.div(100).mul(percentage)
		setInputAmount(
			ethers.utils.formatUnits(newAmount, props.token.tokenDecimal),
		)
		setValue(newAmount)
	}

	const submit = () => {
		if (!working) {
			if (!wallet.account) {
				toast(walletNotConnected)
			}
			else if ((value > 0)) {
				if ((props.stakingTokenBalance.gte(value))) {
					const provider = new ethers.providers.Web3Provider(wallet.ethereum)
					const lpStaking = lpTokenStaking(props.token.stakingContractAddress, provider)
					setWorking(true)
					lpStaking.withdraw(
						value,
					)
						.then((tx) => {
							tx.wait(
								defaults.network.tx.confirmations,
							).then((r) => {
								setWorking(false)
								props.refreshData(Date.now())
								toast({
									...lpTokenUnstaked,
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
							else if (err.code === -32016) {
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
	return (
		<>
			<Flex
				mt='4.2rem'
				flexDir='column'>
				<Flex alignItems="center" justifyContent="space-between">
					<Text as='h4' fontSize='1.24rem' fontWeight='bolder'>Amount</Text>
					<Text as='h4' fontSize='1.24rem' fontWeight='bolder'>
						{
							props.stakingTokenBalance.gt(0) ?
								prettifyNumber(
									ethers.utils.formatUnits(
										props.stakingTokenBalance,
										props.token.tokenDecimal,
									),
									0,
									5) :
								0
						}
					</Text>
				</Flex>
				<Flex
					layerStyle='inputLike'
				>
					<InputGroup>
						<Input
							variant="transparent"
							flex="1"
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
									if (Number(e.target.value) > 0) {
										try {
											setValue(ethers.utils.parseUnits(String(e.target.value), props.token.tokenDecimal))
										}
										catch (err) {
											if (err.code === 'NUMERIC_FAULT') {
												toast(tokenValueTooSmall)
											}
										}
									}
								}
							}}
						>
						</Input>
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
									<LPTokenIconAndSymbol
										float='left'
										logoURI1={props.token.pairTokens[0].logoURI}
										logoURI2={props.token.pairTokens[1].logoURI}
										lpToken={lpToken}
									></LPTokenIconAndSymbol>
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
						onClick={handleAmountChange(props.stakingTokenBalance, 100)}>
						MAX
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={handleAmountChange(props.stakingTokenBalance, 25)}>
						25%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={handleAmountChange(props.stakingTokenBalance, 50)}>
						50%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={handleAmountChange(props.stakingTokenBalance, 75)}>
						75%
					</Button>
				</Flex>
				<Flex mt='5.05rem' justifyContent='center'>
					<Button
						minWidth="230px"
						size="lg"
						variant="solidRadial"
						onClick={submit}
						disabled={working}
					>
						<Text fontWeight="bold">
							{wallet.account ?
								<>
									{!working ?
										<>
											Unstake
										</> :
										<Spinner />
									}
								</> :
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

const ClaimPanel = (props) => {
	ClaimPanel.propTypes = {
		rewardTokenBalance: PropTypes.object.isRequired,
		token: PropTypes.object.isRequired,
		refreshData: PropTypes.func,
	}
	const wallet = useWallet()
	const toast = useToast()
	const [value, setValue] = useState(0)
	const [working, setWorking] = useState(false)
	const [inputAmount, setInputAmount] = useState('')
	const handleAmountChange = (balance, percentage) => () => {
		const newAmount = balance.div(100).mul(percentage)
		setInputAmount(
			ethers.utils.formatUnits(newAmount, props.token.rewardToken.decimal),
		)
		setValue(newAmount)
	}
	const submit = () => {
		if (!working) {
			if (!wallet.account) {
				toast(walletNotConnected)
			}
			else if ((value > 0)) {
				if ((props.rewardTokenBalance.gte(value))) {
					const provider = new ethers.providers.Web3Provider(wallet.ethereum)
					const lpStaking = lpTokenStaking(props.token.stakingContractAddress, provider)
					setWorking(true)
					lpStaking.claim(
						value,
					)
						.then((tx) => {
							tx.wait(
								defaults.network.tx.confirmations,
							).then((r) => {
								setWorking(false)
								props.refreshData(Date.now())
								toast({
									...lpTokenClaimed,
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
							else if (err.code === -32016) {
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
	return (
		<>
			<Flex
				mt='4.2rem'
				flexDir='column'>
				<Flex alignItems="center" justifyContent="space-between">
					<Text as='h4' fontSize='1.24rem' fontWeight='bolder'>Amount</Text>
					<Text as='h4' fontSize='1.24rem' fontWeight='bolder'>
						{
							props.rewardTokenBalance.gt(0) ?
								prettifyNumber(
									ethers.utils.formatUnits(
										props.rewardTokenBalance,
										props.token.rewardToken.tokenDecimal,
									),
									0,
									5) :
								0
						}
					</Text>
				</Flex>
				<Flex
					layerStyle='inputLike'
				>
					<InputGroup>
						<Input
							variant="transparent"
							flex="1"
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
									if (Number(e.target.value) > 0) {
										try {
											setValue(ethers.utils.parseUnits(String(e.target.value), props.token.rewardToken.decimal))
										}
										catch (err) {
											if (err.code === 'NUMERIC_FAULT') {
												toast(tokenValueTooSmall)
											}
										}
									}
								}
							}}
						>
						</Input>
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
										src={props.token.rewardToken.logoURI}
									/>
									<Box
										as='h3'
										m='0'
										fontSize='1.02rem'
										fontWeight='bold'
									>{props.token.rewardToken.symbol}</Box>
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
						onClick={handleAmountChange(props.rewardTokenBalance, 100)}>
						MAX
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={handleAmountChange(props.rewardTokenBalance, 25)}>
						25%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={handleAmountChange(props.rewardTokenBalance, 50)}>
						50%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={handleAmountChange(props.rewardTokenBalance, 75)}>
						75%
					</Button>
				</Flex>
				<Flex mt='5.05rem' justifyContent='center'>
					<Button
						minWidth="230px"
						size="lg"
						variant="solidRadial"
						onClick={submit}
						disabled={working}
					>
						<Text fontWeight="bold">
							CLAIM
						</Text>
					</Button>
				</Flex>
			</Flex>
		</>
	)
}

export default Farm
