import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
	Box, Button, Flex, Text, Tab, TabList, Tabs, TabPanels, TabPanel, NumberInput, NumberInputField,
	InputGroup, InputRightElement, Image, Container, Heading, Badge, Link,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useWallet } from 'use-wallet'
import { ethers } from 'ethers'
import { lpTokenStaking, getERC20BalanceOf } from '../common/ethereum'
import defaults from '../common/defaults'
import { prettifyNumber } from '../common/utils'

const getLPToken = (pairTokens) => pairTokens.map(tk => tk.symbol).join('-')

const Farm = props => {
	return (
		<Box
			height={`calc(100vh - ${defaults.layout.header.minHeight})`}
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
	const [refreshDataToken] = useState(Date.now())

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
						<DetailSection token={token}></DetailSection>
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
						/>
					</TabPanel>
					<TabPanel p='0'>
						<UnstakePanel
							stakingTokenBalance={props.stakingTokenBalance}
							token={props.token}
						/>
					</TabPanel>
					<TabPanel p='0'>
						<ClaimPanel
							rewardTokenBalance={props.rewardTokenBalance}
							token={props.token}
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
	}
	const lpToken = props.token.pairTokens.map(tk => tk.symbol).join('-')
	const rewardToken = props.token.rewardToken
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
						>APY</Badge>
					</Box>
					<Box fontSize={{ base: '1.3rem', md: '2.3rem', lg: '2.3rem' }} lineHeight='1.2' fontWeight='normal' mb='19px' textAlign='left'>
						159%
					</Box>
				</Container>
				<Container p='0'>
					<Box textAlign='left'>
						<Badge
							fontSize='1rem'
							colorScheme='accent'
						>REWARD</Badge>
					</Box>
					<Box float='left'>1000</Box>
					<Image
						width='24px'
						height='24px'
						mr='0px'
						float='left'
						src={rewardToken.logoURI}
					/>
					{rewardToken.symbol}/WEEK
				</Container>
			</Flex>
			<Flex>
				<Container p='0'>
					AVAILABLE IN WALLET
				</Container>
				<Container p='0'>
					<Box textAlign='left'>
						<Box float='left'>10000</Box>
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
				<Container p='0'>
					TOTAL STAKED
				</Container>
				<Container p='0'>
					<Box float='left'>20000</Box>
					<LPTokenIconAndSymbol
						float='left'
						logoURI1={props.token.pairTokens[0].logoURI}
						logoURI2={props.token.pairTokens[1].logoURI}
						lpToken={lpToken}
					></LPTokenIconAndSymbol>
				</Container>
			</Flex>
			<Flex>
				<Container p='0'>
					CLAIMABLE REWARDS
				</Container>
				<Container p='0'>
					<Box>
						<Box float='left'>100</Box>
						<Image
							width='24px'
							height='24px'
							mr='0px'
							float='left'
							src={rewardToken.logoURI}
						/>
						{rewardToken.symbol}
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
	}
	const lpToken = getLPToken(props.token.pairTokens)
	const amount = '100'
	const handleChange = () => { console.log('handling')}
	return (
		<>
			<Flex
				mt='4.2rem'
				flexDir='column'>
				<Flex alignItems="center" justifyContent="space-between">
					<Text as='h4' fontSize='1.24rem' fontWeight='bolder'>Amount</Text>
					<Text>{
						props.availableTokenBalance.gt(0) &&
							prettifyNumber(
								ethers.utils.formatUnits(
									props.availableTokenBalance,
									props.token.tokenDecimal,
								),
								0,
								5)
					}</Text>
				</Flex>
				<Flex
					layerStyle='inputLike'
				>
					<InputGroup>
						<NumberInput
							variant="transparent"
							flex="1"
							value={amount}
							max={amount}
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
									<LPTokenIconAndSymbol
										float='left'
										logoURI1={props.token.pairTokens[0].logoURI}
										logoURI2={props.token.pairTokens[1].logoURI}
										lpToken={lpToken}
									></LPTokenIconAndSymbol>
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
						onClick={handleChange}>
						MAX
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={handleChange}>
						25%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={handleChange}>
						50%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={handleChange}>
						75%
					</Button>
				</Flex>
				<Flex mt='5.05rem' justifyContent='center'>
					<Button
						minWidth="230px"
						size="lg"
						variant="solidRadial"
						onClick={handleChange}
						disabled={false}
					>
						<Text fontWeight="bold">
							STAKE
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
	}
	const lpToken = getLPToken(props.token.pairTokens)
	const amount = '100'
	const handleChange = () => { console.log('handling') }
	return (
		<>
			<Flex
				mt='4.2rem'
				flexDir='column'>
				<Flex alignItems="center" justifyContent="space-between">
					<Text as='h4' fontSize='1.24rem' fontWeight='bolder'>Amount</Text>
					<Text>
						{
							props.stakingTokenBalance.gt(0) &&
							prettifyNumber(
								ethers.utils.formatUnits(
									props.stakingTokenBalance,
									props.token.tokenDecimal,
								),
								0,
								5)
						}
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
							max={amount}
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
									<LPTokenIconAndSymbol
										float='left'
										logoURI1={props.token.pairTokens[0].logoURI}
										logoURI2={props.token.pairTokens[1].logoURI}
										lpToken={lpToken}
									></LPTokenIconAndSymbol>
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
						onClick={handleChange}>
						MAX
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={handleChange}>
						25%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={handleChange}>
						50%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={handleChange}>
						75%
					</Button>
				</Flex>
				<Flex mt='5.05rem' justifyContent='center'>
					<Button
						minWidth="230px"
						size="lg"
						variant="solidRadial"
						onClick={handleChange}
						disabled={false}
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

const ClaimPanel = (props) => {
	ClaimPanel.propTypes = {
		rewardTokenBalance: PropTypes.object.isRequired,
		token: PropTypes.object.isRequired,
	}
	const tokenSelect = defaults.stakeable[0]
	const amount = '100'
	const handleChange = () => { console.log('handling') }
	return (
		<>
			<Flex
				mt='4.2rem'
				flexDir='column'>
				<Flex alignItems="center" justifyContent="space-between">
					<Text as='h4' fontSize='1.24rem' fontWeight='bolder'>Amount</Text>
					<Text>
						{
							props.rewardTokenBalance.gt(0) &&
							prettifyNumber(
								ethers.utils.formatUnits(
									props.rewardTokenBalance,
									props.token.rewardToken.tokenDecimal,
								),
								0,
								5)
						}
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
							max={amount}
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
						onClick={handleChange}>
						MAX
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={handleChange}>
						25%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={handleChange}>
						50%
					</Button>
					<Button
						variant='outline'
						size='sm'
						mr='0.4rem'
						onClick={handleChange}>
						75%
					</Button>
				</Flex>
				<Flex mt='5.05rem' justifyContent='center'>
					<Button
						minWidth="230px"
						size="lg"
						variant="solidRadial"
						onClick={handleChange}
						disabled={false}
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
