import React, { useEffect, useState } from 'react'
import {
	Box,
	Badge,
	Flex,
	Text,
	Button,
	NumberInput,
	NumberInputField,
	Image,
	List,
	ListItem,
	useToast,
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import defaults from '../common/defaults'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { approveERC20ToSpend, convertVaderToUsdv, getERC20Allowance,
	 upgradeVetherToVader, redeemToVADER } from '../common/ethereum'
import { prettifyCurrency } from '../common/utils'
import { useWallet } from 'use-wallet'
import { approved, insufficientBalance, rejected, failed,
	vaderconverted, vethupgraded, usdvredeemed } from '../messages'

export const Redeem = (props) => {
	const tokens = [
		{
			'chainId':defaults.network.chainId,
			'address':defaults.address.vether,
			'name':'VETHER',
			'symbol':'VETH',
			'decimals':18,
			'logoURI':'https://assets.coingecko.com/coins/images/11375/thumb/vether-symbol-coingecko.png?1622341592',
			'convertsTo':'VADER',
		},
	]
	const wallet = useWallet()
	const toast = useToast()
	const [showTokenList, setShowTokenList] = useState(false)
	const [tokenSelect, setTokenSelect] = useState(tokens[0])
	const [amount, setAmount] = useState(0)
	const [spendAllowed, setSpendAllowed] = useState(true)
	const [conversionFactor, setConversionFactor] = useState(ethers.BigNumber.from(String(defaults.vader.conversionRate)))
	const [working, setWorking] = useState(false)

	const HiddenList = {
		visibility: 'hidden',
		opacity: 0,
		display: 'none',
	}

	const ShowList = {
		position: 'absolute',
		transition: 'all 0.5s ease',
		marginTop: '1rem',
		left: '-18px',
	}

	const ToggleList = {
		visibility: 'visible',
		opacity: 1,
		display: 'block',
	}

	const DrawAmount = () => {
		if (tokenSelect.symbol === 'VETH' && amount >= 1000001) {
			return <>👻👻👻</>
	 	}
		else {
			return <>{prettifyCurrency(amount * conversionFactor.toNumber(), 0, 5, tokenSelect.convertsTo)}</>
		}
	}

	useEffect(() => {
		if (tokenSelect.symbol === 'VETH') {
			setConversionFactor(
				ethers.BigNumber.from(String(defaults.vader.conversionRate)),
			)
		}
		return () => setConversionFactor(ethers.BigNumber.from('0'))
	}, [tokenSelect])

	useEffect(() => {
		if(wallet.account) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getERC20Allowance(tokenSelect.address,
				wallet.account,
				defaults.address.vader,
				provider)
				.then(n => {
					if (
						n.gt(ethers.BigNumber.from('0'))
							&& n.gte(ethers.BigNumber.from(String(amount)))
					) {
						setSpendAllowed(true)
					}
					else {
						setSpendAllowed(false)
					}
				})
				.catch(console.log)
		}
	}, [wallet.account, tokenSelect, amount])

	return (
		<Box
			height={`calc(100vh - ${defaults.layout.header.minHeight})`}
			maxWidth={defaults.layout.container.sm.width}
			m='0 auto'
			p={{ base: '5rem 1.2rem 0', md: '5rem 0 0' }}
			{...props}
		>
			<Flex
				w='100%'
				maxW='49ch'
				minH='478.65px'
				m='0 auto'
				p='2rem 2.6rem'
				layerStyle='colorful'
				flexDir='column'
			>
				<Text align='center' fontSize='1.55rem' fontWeight='bolder'>
            Asset redemption
				</Text>
				<Text align='center' fontSize='1.12rem' display='block' mb='2rem'>
            Redeem assets by burning your tokens.
				</Text>
				<Text as='h4' fontSize='1.24rem' fontWeight='bolder'>Asset amount to burn</Text>
				<Flex layerStyle='inputLike'>
					<Box flex='1' pr='0.5rem'>
						<NumberInput
						  min={0}
							variant='transparent'
							value={amount}
							clampValueOnBlur={false}
							onChange={(n) => {
								if(Number(n) >= 0) {
									setAmount(n)
								}
								else {
									setAmount(0)
								}
							}}>
							<NumberInputField placeholder='0.0' border='none' fontSize='1.3rem' />
						</NumberInput>
					</Box>
					<Flex
						position='relative'
						cursor='pointer'
						zIndex='1'
						onClick={() => setShowTokenList(!showTokenList)}>
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
								textTransform='capitalize'>{tokenSelect.symbol}</Box>
							{!showTokenList ? <TriangleDownIcon ml={1} /> : <TriangleUpIcon ml={1} />}
						</Box>
						<Box {...(showTokenList ? ShowList : HiddenList)}
							layerStyle='opaque'
							padding='1rem'
							mt='2.5rem'>
							<List {...ToggleList}>
								{tokens.map(token =>
									<ListItem
										key={token.name}
										mb='0.5rem'
										d='flex'
										alignItems='center'
										minWidth='108px'
										_hover={{
											opacity: '0.74',
										}}
										onClick={() => setTokenSelect(token)}
									>
										<Image
											width='26px'
											height='26px'
											mr='10px'
											src={token.logoURI}
										/>
										<Box
											as='span'
										>
											{token.symbol}
										</Box>
									</ListItem>,
								)}
							</List>
						</Box>
					</Flex>
				</Flex>

				<Flex
					m='1.66rem 0' fontSize='1.5rem' fontWeight='bolder'
					justifyContent='center' alignItems='center' flexDir='column'>
					{DrawAmount()}
					<Box as='h3' fontWeight='bold' textAlign='center'>
						<Badge as='div' background='rgb(214, 188, 250)' color='rgb(128, 41, 251)'>What You Get</Badge>
					</Box>
				</Flex>

				<Button
					variant='solidRadial'
					m='0 auto 2rem'
					size='lg'
					minWidth='230px'
					textTransform='uppercase'
					loadingText='Submitting'
					isLoading={working}
					onClick={() => {
						if(wallet.account) {
							const provider = new ethers.providers.Web3Provider(wallet.ethereum)
							if(spendAllowed) {
								setWorking(true)
								if (tokenSelect.symbol === 'VETH') {
									upgradeVetherToVader(
										ethers.utils.parseUnits(String(amount)).toString(),
										provider,
									)
										.then(() => {
											setWorking(false)
											toast(vethupgraded)
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
												console.log('Error code is:' + err.code)
												console.log('Error:' + err)
												toast(failed)
											}
										})
								}
								if (tokenSelect.symbol === 'VADER') {
									convertVaderToUsdv(
										ethers.utils.parseUnits(String(amount)).toString(),
										provider,
									)
										.then(() => {
											setWorking(false)
											toast(vaderconverted)
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
												console.log('Error code is:' + err.code)
												console.log('Error:' + err)
												toast(failed)
											}
										})
								}
								if (tokenSelect.symbol === 'USDV') {
									redeemToVADER(
										ethers.utils.parseUnits(String(amount)).toString(),
										provider,
									)
										.then(() => {
											setWorking(false)
											toast(usdvredeemed)
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
												console.log('Error code is:' + err.code)
												console.log('Error:' + err)
												toast(failed)
											}
										})
								}
							}
 							else {
								setWorking(true)
								approveERC20ToSpend(
									tokenSelect.address,
									defaults.address.vader,
									'302503999000000000299700000',
									provider,
								)
									.then(() => {
										setWorking(false)
										toast(approved)
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
											console.log('Error code is:' + err.code)
											console.log('Error:' + err)
											toast(failed)
										}
									})
							}
						}
					}}
				>
					{spendAllowed &&
						'Burn'
					}
					{!spendAllowed &&
						'Approve Token'
					}
				</Button>
			</Flex>
		</Box>
	)
}

export default Redeem
