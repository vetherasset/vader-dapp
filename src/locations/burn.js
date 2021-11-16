import React, { useEffect, useState } from 'react'
import {
	Box,
	Badge,
	Flex,
	Text,
	Button,
	Input,
	Image,
	List,
	Link,
	Spinner,
	ListItem,
	useToast,
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import defaults from '../common/defaults'
// import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { getERC20Allowance, convertVetherToVader, approveERC20ToSpend, getERC20BalanceOf } from '../common/ethereum'
import { prettifyCurrency } from '../common/utils'
import { useWallet } from 'use-wallet'
import { insufficientBalance, rejected, failed, vethupgraded, walletNotConnected, noAmount,
	tokenValueTooSmall,
	noToken0,
	approved,
	exception } from '../messages'

const Burn = (props) => {

	const tokens = defaults.redeemables
	const wallet = useWallet()
	const toast = useToast()
	const [showTokenList] = useState(false)
	const [tokenSelect, setTokenSelect] = useState(tokens[0])
	const [tokenApproved, setTokenApproved] = useState(false)
	const [tokenBalance, setTokenBalance] = useState(ethers.BigNumber.from('0'))
	const [inputAmount, setInputAmount] = useState('')
	const [value, setValue] = useState(0)
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
		if (tokenSelect.symbol === 'VETH' && Number(inputAmount) >= 1000001) {
			return <>👻👻👻</>
	 	}
		return <>
			{prettifyCurrency(
				Number(inputAmount) * Number(conversionFactor),
				0,
				5,
				tokenSelect.convertsTo,
			)}
		</>
	}

	const submit = () => {
		if(!working) {
			if(!wallet.account) {
				toast(walletNotConnected)
			}
			else if (!tokenSelect) {
				toast(noToken0)
			}
			else if (tokenSelect && !tokenApproved) {
				const provider = new ethers.providers.Web3Provider(wallet.ethereum)
				setWorking(true)
				approveERC20ToSpend(
					tokenSelect.address,
					defaults.address.xvader,
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
				if ((tokenBalance.gte(value))) {
					const provider = new ethers.providers.Web3Provider(wallet.ethereum)
					setWorking(true)
					if (tokenSelect.symbol === 'VETH') {
						convertVetherToVader(
							value,
							provider)
							.then((tx) => {
								tx.wait(
									defaults.network.tx.confirmations,
								).then((r) => {
									setWorking(false)
									toast({
										...vethupgraded,
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
								else {
									console.log(err)
									toast(failed)
								}
							})
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
		if(wallet.account && tokenSelect) {
			setWorking(true)
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getERC20Allowance(
				tokenSelect.address,
				wallet.account,
				defaults.address.xvader,
				provider,
			).then((n) => {
				setWorking(false)
				if(n.gt(0))	setTokenApproved(true)
			})
		}
		return () => {
			setWorking(true)
			setTokenApproved(false)
		}
	}, [wallet.account, tokenSelect])

	useEffect(() => {
		if (wallet.account && tokenSelect) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getERC20BalanceOf(
				tokenSelect.address,
				wallet.account,
				provider,
			)
				.then(data => {
					setTokenBalance(data)
				})
				.catch(console.error)
		}
		return () => setTokenBalance(ethers.BigNumber.from('0'))
	}, [wallet.account, tokenSelect])

	console.log(tokenBalance)

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
											setValue(ethers.utils.parseUnits(String(e.target.value), 18))
										}
										catch(err) {
											if (err.code === 'NUMERIC_FAULT') {
												toast(tokenValueTooSmall)
											}
										}
									}
								}
							}}/>
					</Box>
					<Flex
						background='rgba(255, 255, 255, 0.16)'
						borderRadius='0.375rem'
						border='1px solid rgba(255, 255, 255, 0.04)'
						paddingInlineStart='0.5rem'
						paddingInlineEnd='0.5rem'
						position='relative'
						cursor='default'
						zIndex='1'
						// onClick={() => setShowTokenList(!showTokenList)}
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
								textTransform='capitalize'>{tokenSelect.symbol}</Box>
							{/* {!showTokenList ? <TriangleDownIcon ml={1} /> : <TriangleUpIcon ml={1} />} */}
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
					disabled={working}
					onClick={() => submit()}
				>
					{wallet.account &&
								<>
									{!working &&
										<>
											{tokenSelect && !tokenApproved &&
												<>
													Approve {tokenSelect.symbol}
												</>
											}
											{tokenSelect && tokenApproved &&
												<>
													Burn
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
									Burn
								</>
					}
				</Button>
			</Flex>
		</Box>
	)
}

export default Burn
