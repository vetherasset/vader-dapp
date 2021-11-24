import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import {
	Box,
	Badge,
	Flex,
	Text,
	Button,
	Input,
	InputGroup,
	InputRightAddon,
	Image,
	Link,
	Spinner,
	useToast,
	Container,
	useDisclosure,
	Checkbox,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	AlertDialog,
	AlertDialogOverlay,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogBody,
	AlertDialogFooter,
	useBreakpointValue,
} from '@chakra-ui/react'
import { TokenSelector } from '../components/TokenSelector'
import { ethers } from 'ethers'
import defaults from '../common/defaults'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { getERC20Allowance, convert, approveERC20ToSpend, getERC20BalanceOf } from '../common/ethereum'
import { getMerkleProofForAccount, prettifyCurrency } from '../common/utils'
import { useWallet } from 'use-wallet'
import { insufficientBalance, rejected, failed, vethupgraded, walletNotConnected, noAmount,
	tokenValueTooSmall,
	noToken0,
	approved,
	exception } from '../messages'

const Burn = (props) => {

	const wallet = useWallet()
	const toast = useToast()
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [isSelect, setIsSelect] = useState(-1)
	const [tokenSelect, setTokenSelect] = useState(false)
	const [tokenApproved, setTokenApproved] = useState(false)
	const [tokenBalance, setTokenBalance] = useState(ethers.BigNumber.from('0'))
	const [inputAmount, setInputAmount] = useState('')
	const [value, setValue] = useState(0)
	const [conversionFactor, setConversionFactor] = useState(ethers.BigNumber.from(String(defaults.vader.conversionRate)))
	const [vethAllowLess, setVethAllowLess] = useState(false)
	const [working, setWorking] = useState(false)

	const DrawAmount = () => {
		return <>
			{inputAmount &&
				prettifyCurrency(
					(Number(inputAmount) * Number(conversionFactor)) / 2,
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
						convert(
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
				defaults.address.converter,
				provider,
			).then((n) => {
				setWorking(false)
				if(n.gt(0))	setTokenApproved(true)
			})
		}
		return () => {
			setWorking(false)
			setTokenApproved(false)
		}
	}, [wallet.account, tokenSelect])

	useEffect(() => {
		if (wallet.account && tokenSelect) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			setWorking(true)
			getERC20BalanceOf(
				tokenSelect.address,
				wallet.account,
				provider,
			)
				.then(data => {
					setTokenBalance(data)
					if (tokenSelect.symbol === 'VETH') {
						setWorking(false)
						setValue(data)
						setInputAmount(ethers.utils.formatUnits(data, tokenSelect.decimals))
					}
				})
				.catch((err) => {
					setWorking(false)
					console.log(err)
				})
		}
		return () => setTokenBalance(ethers.BigNumber.from('0'))
	}, [wallet.account, tokenSelect])

	useEffect(() => {
		if (wallet.account) {
			console.log(getMerkleProofForAccount(wallet.account))
		}
	}, [wallet.account])

	return (
		<>
			<Box
				minHeight={`calc(90vh - ${defaults.layout.header.minHeight})`}
				maxWidth={defaults.layout.container.sm.width}
				m='0 auto'
				p={{ base: '5rem 1.1rem 0', md: '5rem 0 0' }}
				{...props}
			>
				<Flex
					w='100%'
					maxW='49ch'
					m='0 auto'
					minH={{ base: 'auto', md: '478.65px' }}
					mb='5rem'
					p={{ base: '2rem 0.9rem', md: '2rem 2.6rem' }}
					layerStyle='colorful'
					flexDir='column'
				>
					<Text
						align='center'
						fontSize={{ base: '1.25rem', md: '1.55rem' }}
						fontWeight='bolder'
					>
            Acquire assets
					</Text>
					<Text
						align='center'
						fontSize={{ base: '0.91rem', md: '1.12rem' }}
						display='block'
						mb='2rem'
					>
            Make claim or burn to obtain assets.
					</Text>

					<Text
						as='h4'
						fontSize='1.24rem'
						fontWeight='bolder'>
							Token
					</Text>
					<Flex
						marginBottom='0.7rem'>
						<Button
							variant='outline'
							w='100%'
							size='lg'
							textTransform='none'
							leftIcon={ tokenSelect ? <Image
								width='24px'
								height='24px'
								src={tokenSelect.logoURI}
							/> : '' }
							rightIcon={<ChevronDownIcon />}
							onClick={() => {
								onOpen()
								setIsSelect(0)
							}}>
							{tokenSelect &&
											<>
    										{tokenSelect.symbol}
											</>
							}
							{!tokenSelect &&
											<>
    										Select a token
											</>
							}
						</Button>
					</Flex>

					{tokenSelect &&
						<>
							{tokenSelect.symbol === 'VETH' &&
								<>
									<Alert
										m='1rem 0 1rem'
										status='warning'>
										<AlertIcon />
										<Box flex='1'>
											<AlertTitle mr={2}>No way to burn multiple times</AlertTitle>
											<AlertDescription>This token can be burned by eligible account only once. If you decide to burn less than you&apos;re entitled to, you&apos;ll be not able to burn more afterwards and so claim the maximal amount.</AlertDescription>
										</Box>
									</Alert>
									<Alert
										m='0 0 1rem'
										status='info'>
										<AlertIcon />
										<Box flex='1'>
											<AlertDescription>Vested portion&apos;s linearly released for 1&nbsp;year. Claiming has no limit, can be also done at&nbsp;any time.</AlertDescription>
										</Box>
									</Alert>
									<Text
										as='h4'
										fontSize='1.1rem'
										fontWeight='bolder'
										mr='0.66rem'
										opacity={ tokenSelect ? '' : '0.5' }>
										Current breakdown
									</Text>

									<Flex
										flexDir='column'
										p='0 2rem'
										marginBottom='.7rem'
										opacity='0.87'
									>

										<Flex>
											<Container p='0'>
												<Box
													textAlign='left'
												>
													Total entitled
												</Box>
											</Container>
											<Container p='0'>
												<Box
													textAlign='right'
												>
													99999&nbsp;<span style={{ fontSize: '0.8rem' }}>VADER</span>
												</Box>
											</Container>
										</Flex>

										<Flex>
											<Container p='0'>
												<Box
													textAlign='left'>
													Claimed
												</Box>
											</Container>
											<Container p='0'>
												<Box
													textAlign='right'>
														49999.5&nbsp;<span style={{ fontSize: '0.8rem' }}>VADER</span>
												</Box>
											</Container>
										</Flex>

										<Flex>
											<Container p='0'>
												<Box
													textAlign='left'>
													Remains vested
												</Box>
											</Container>
											<Container p='0'>
												<Box
													textAlign='right'>
														49999.5&nbsp;<span style={{ fontSize: '0.8rem' }}>VADER</span>
												</Box>
											</Container>
										</Flex>

										<Flex>
											<Container p='0'>
												<Box
													textAlign='left'>
													Claimable now
												</Box>
											</Container>
											<Container p='0'>
												<Box
													textAlign='right'>
														432&nbsp;<span style={{ fontSize: '0.8rem' }}>VADER</span>
												</Box>
											</Container>
										</Flex>
									</Flex>
								</>
							}
						</>
					}

					<Text
						as='h4'
						fontSize='1.1rem'
						fontWeight='bolder'
						mr='0.66rem'
						opacity={ tokenSelect ? '' : '0.5' }>
								Amount
					</Text>
					<Flex
						layerStyle='inputLike'
						cursor={ tokenSelect ? '' : 'not-allowed' }
					>
						<Box flex='1' pr='0.5rem'>
							<InputGroup>
								<Input
						  		variant='transparent'
									flex='1'
									cursor={ tokenSelect ? '' : 'not-allowed' }
									disabled={
										tokenSelect.symbol === 'VETH' && !vethAllowLess ? true : false
									}
									_disabled={
										tokenSelect.symbol === 'VETH' ? {
											opacity: 1,
										} : '' }
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
								{tokenSelect &&
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
													src={tokenSelect.logoURI}
												/>
												<Box
													as='h3'
													m='0'
													fontSize='1.02rem'
													fontWeight='bold'
													textTransform='capitalize'>{tokenSelect.symbol}</Box>
											</Box>
										</Flex>
									</InputRightAddon>
								}
							</InputGroup>
						</Box>
					</Flex>

					{tokenSelect && tokenSelect.symbol === 'VETH' &&
							<VethAllowLessOption
								allow={vethAllowLess}
								setAllow={setVethAllowLess}/>
					}

					<Flex
						m='1.66rem 0'
						fontSize={{ base: '1.35rem', md: '1.5rem' }}
						fontWeight='bolder'
						justifyContent='center' alignItems='center' flexDir='column'>
						{inputAmount &&
								<>
									{DrawAmount()}
									<Box
										as='h3'
										fontWeight='bold'
										textAlign='center'
										fontSize='1rem'
									>
										<Badge
											as='div'
											fontSize={{ base: '0.6rem', md: '0.75rem' }}
											background='rgb(214, 188, 250)'
											color='rgb(128, 41, 251)'
										>What You Receive Now
										</Badge>
									</Box>
								</>
						}
					</Flex>

					<Button
						variant='solidRadial'
						m='0 auto 2rem'
						size='lg'
						minWidth='230px'
						textTransform='uppercase'
						disabled={working}
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
			<TokenSelector
				isSelect={isSelect}
				setToken0={setTokenSelect}
				tokenList={defaults.redeemables}
				isOpen={isOpen}
				onOpen={onOpen}
				onClose={onClose}
			/>
		</>
	)
}

const VethAllowLessOption = (props) => {

	VethAllowLessOption.propTypes = {
		allow: PropTypes.bool.isRequired,
		setAllow: PropTypes.func.isRequired,
	}

	const [isOpen, setIsOpen] = useState(false)
	const onClose = () => setIsOpen(false)
	const cancelRef = useRef()

	return (
		<>

			<Checkbox
				maxW='236.95px'
				colorScheme='pink'
				size='lg'
				mt='0.7rem'
				isChecked={props.allow}
				onChange={() => {
					if(props.allow === true) {
						props.setAllow(false)
					}
				}}
				onClick={() => {
					if(!props.allow) {
						setIsOpen(true)
					}
				}}
			>
				Allow me to adjust amount
			</Checkbox>

			<AlertDialog
				isCentered={useBreakpointValue({ base: true, md: false })}
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Allow to adjust amount
						</AlertDialogHeader>
						<AlertDialogBody
							padding='0 1.5rem'>
              Are you sure? You can&apos;t burn more of this token afterwards.
							This&nbsp;might result in loss of potentional claim portion.
						</AlertDialogBody>
						<AlertDialogFooter>
							<Flex
								borderRadius='12px'
								bg='#a68da6'
								border='1px solid #3425352e'
							>
								<Button
									variant='outline'
									ref={cancelRef}
									onClick={onClose}
									color='#fff'
								>
                Cancel
								</Button>
							</Flex>
							<Flex
								borderRadius='12px'
								border='1px solid #3425352e'
								bg='green.500'
								ml={3}
							>
								<Button
									variant='outline'
									onClick={() => {
										props.setAllow(true)
										setIsOpen(false)
									}}
								>
									Allow
								</Button>
							</Flex>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	)
}

export default Burn
