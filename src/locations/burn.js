import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useLocalStorage, useSessionStorage } from 'react-use'
import {
	Box,
	Badge,
	Flex,
	Text,
	Button,
	Input,
	InputGroup,
	InputRightAddon,
	InputRightElement,
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
	useRadio,
	useRadioGroup,
	HStack,
	Tag,
	TagLabel,
	TagLeftIcon,
} from '@chakra-ui/react'
import { TokenSelector } from '../components/TokenSelector'
import { ethers } from 'ethers'
import defaults from '../common/defaults'
import { ChevronDownIcon, CheckCircleIcon } from '@chakra-ui/icons'
import { BsPauseCircleFill } from 'react-icons/bs'
import { getERC20Allowance, convert, approveERC20ToSpend,
	getClaimed, getVester, claim, minterMint, minterBurn,
	usdvClaimAll } from '../common/ethereum'
import { getMerkleProofForAccount, getMerkleLeaf, prettifyCurrency, getPercentage } from '../common/utils'
import { useWallet } from 'use-wallet'
import { insufficientBalance, rejected, failed, vethupgraded, walletNotConnected, noAmount,
	tokenValueTooSmall,
	noToken0,
	approved,
	exception,
	vaderclaimed,
	notBurnEligible,
	nothingtoclaim,
	nomorethaneligible,
	vaderconverted,
	usdvredeemed,
	notyetUnlocked,
	dailyLimitReached,
} from '../messages'
import { useClaimableVeth } from '../hooks/useClaimableVeth'
import { useUniswapTWAP } from '../hooks/useUniswapTWAP'
import { usePublicFee } from '../hooks/usePublicFee'
import { useMinterDailyLimits } from '../hooks/useMinterDailyLimits'
import { useMinter } from '../hooks/useMinter'
import { useERC20Balance } from '../hooks/useERC20Balance'
import { useLocks } from '../hooks/useLocks'
import prettyMilliseconds from 'pretty-ms'
import TimeAgo from 'react-timeago'
import { useUsdvMintedBurnt } from '../hooks/useUsdvMintedBurnt'

const Burn = (props) => {


	const wallet = useWallet()
	const toast = useToast()
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [isSelect, setIsSelect] = useState(-1)
	const [tokenSelect, setTokenSelect] = useState(false)
	const [tokenApproved, setTokenApproved] = useState(false)
	const balance = useERC20Balance(tokenSelect?.address)
	const [inputAmount, setInputAmount] = useState('')
	const [value, setValue] = useState(0)
	const [conversionFactor, setConversionFactor] = useState(ethers.BigNumber.from('0'))
	const [working, setWorking] = useState(false)

	const [vethAllowLess, setVethAllowLess] = useState(false)
	const [vethAccountLeafClaimed, setVethAccountLeafClaimed] = useState(false)
	const claimableVeth = useClaimableVeth()
	const [vester, setVester] = useState([])

	const [slippageTolAmount, setSlippageTolAmount] = useSessionStorage('acquireSlippageTolAmount042334310', '')
	const [slippageTol, setSlippageTol] = useSessionStorage('acquireSlippageTol042434310', 3)
	const [submitOption, setSubmitOption] = useLocalStorage('acquireSubmitOption23049', false)

	const { data: minter } = useMinter()
	const uniswapTWAP = useUniswapTWAP()
	const publicFee = usePublicFee()
	const fee = publicFee?.data?.mul(value).div(1e4)
	const usdcTWAP = ethers.utils.parseEther(
		String(1 / Number(ethers.utils.formatUnits(uniswapTWAP?.data ? uniswapTWAP.data : '1', 18))))

	const { data: limits } = useMinterDailyLimits()
	const locks = useLocks(tokenSelect.symbol)
	const locksComplete = useLocks(undefined, false, 0, (defaults.api.graphql.pollInterval / 2))

	const unclaimed = locks?.data?.locks.length > 1 ? locks?.data?.locks?.reduce((acc, lock) => {
		acc = acc.add(ethers.BigNumber.from(lock?.amount))
		return acc
	}, ethers.BigNumber.from('0')) : ethers.BigNumber.from(locks?.data?.locks.length > 0 ? locks?.data?.locks[0]?.amount : '0')

	const [releaseTime, setReleaseTime] = useState(new Date())
	const [now, setNow] = useState(new Date())

	const usdvMinted = useUsdvMintedBurnt(false, (defaults.api.graphql.pollInterval / 2))
	const dailyLimitMint = usdvMinted?.data?.globals?.[0]?.value && limits?.[1] ?
		ethers.BigNumber.from('0').lt(limits?.[1]) ?
			limits?.[1].sub(ethers.BigNumber.from('0')) :
			ethers.BigNumber.from(usdvMinted?.data?.globals?.[0]?.value).eq(limits?.[1]) ?
				ethers.BigNumber.from('0') : ethers.BigNumber.from('0') : ethers.BigNumber.from('0')

	const usdvBurnt = useUsdvMintedBurnt(true, (defaults.api.graphql.pollInterval / 2))
	const dailyLimitBurnt = usdvBurnt?.data?.globals?.[0]?.value && limits?.[2] ?
		ethers.BigNumber.from(usdvBurnt?.data?.globals?.[0]?.value).lt(limits?.[2]) ?
			limits?.[2].sub(ethers.BigNumber.from(usdvBurnt?.data?.globals?.[0]?.value)) :
			ethers.BigNumber.from(usdvBurnt?.data?.globals?.[0]?.value).eq(limits?.[2]) ?
				ethers.BigNumber.from('0') : ethers.BigNumber.from('0') : ethers.BigNumber.from('0')

	useEffect(() => {
		if(locksComplete?.data?.locks[0]?.release) {
			setReleaseTime(new Date(locksComplete?.data?.locks[0]?.release * 1000))
		}
	}, [locksComplete?.data?.locks[0]?.release])

	useEffect(() => {
		const id = setInterval(() => setNow(new Date()), 1000)
		return () => clearInterval(id)
	}, [])

	useEffect(() => {
		locks.refetch()
		usdvMinted.refetch()
		usdvBurnt.refetch()
	}, [tokenSelect, submitOption, releaseTime])

	const submit = () => {
		if(!working) {
			if(!wallet.account) {
				toast(walletNotConnected)
			}
			else if (!tokenSelect) {
				toast(noToken0)
			}
			else if (!tokenApproved && !submitOption) {
				const provider = new ethers.providers.Web3Provider(wallet.ethereum)
				if (tokenSelect.symbol === 'VETH' &&
				balance?.data &&
				!vethAccountLeafClaimed) {
					if ((balance?.data > 0 && value > 0)) {
						if((!defaults.redeemables[0].snapshot[wallet.account]) ||
						(!Number(defaults.redeemables[0].snapshot[wallet.account]) > 0)) {
							toast(notBurnEligible)
						}
						else {
							setWorking(true)
							approveERC20ToSpend(
								tokenSelect.address,
								defaults.address.converter,
								vethAllowLess ? value : balance?.data,
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
									if(err.code === 4001) {
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
					else if (
						((!defaults.redeemables[0].snapshot[wallet.account]) ||
						(!Number(defaults.redeemables[0].snapshot[wallet.account]) > 0)) &&
						!vethAllowLess) {
						toast(notBurnEligible)
					}
					else if (vethAllowLess && !value > 0) {
						toast(noAmount)
					}
					else {
						toast(insufficientBalance)
					}
				}
				if (tokenSelect.symbol !== 'VETH' &&
				tokenSelect.symbol !== 'USDV' &&
				!submitOption) {
					setWorking(true)
					approveERC20ToSpend(
						tokenSelect.address,
						tokenSelect.convertsTo.address,
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
							if(err.code === 4001) {
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
			else if (tokenSelect.symbol === 'VETH' &&
			vethAccountLeafClaimed) {
				if(vester?.[0]?.gt(0)) {
					const provider = new ethers.providers.Web3Provider(wallet.ethereum)
					setWorking(true)
					claim(provider)
						.then((tx) => {
							tx.wait(
								defaults.network.tx.confirmations,
							).then((r) => {
								setWorking(false)
								setVethAccountLeafClaimed(true)
								toast({
									...vaderclaimed,
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
							else {
								console.log(err)
								toast(failed)
							}
						})
				}
				else {
					toast(nothingtoclaim)
				}
			}
			else if (!submitOption) {
				if(value > 0) {
					if ((balance?.data?.gte(value))) {
						const provider = new ethers.providers.Web3Provider(wallet.ethereum)
						if (tokenSelect.symbol === 'VETH') {
							if (defaults.redeemables[0].snapshot[wallet.account] &&
								Number(defaults.redeemables[0].snapshot[wallet.account]) > 0) {
								setWorking(true)
								const proof = getMerkleProofForAccount(wallet.account, defaults.redeemables[0].snapshot)
								convert(
									proof,
									defaults.redeemables[0].snapshot[wallet.account],
									value.mul(ethers.BigNumber.from(conversionFactor)),
									provider)
									.then((tx) => {
										tx.wait(
											defaults.network.tx.confirmations,
										).then((r) => {
											setWorking(false)
											setVethAccountLeafClaimed(true)
											toast({
												...vethupgraded,
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
											console.log('Transaction rejected: You have decided to reject the transaction..')
											toast(rejected)
										}
										else {
											console.log(err)
											toast(failed)
										}
									})
							}
							else {
								toast(notBurnEligible)
							}
						}
						else if (tokenSelect.symbol === 'USDV') {
							if((dailyLimitBurnt && dailyLimitBurnt.gt(0))) {
								setWorking(true)
								const feeAmount = usdcTWAP?.mul(fee).div(ethers.utils.parseUnits('1', 18))
								const amount = value?.mul(usdcTWAP).div(ethers.utils.parseUnits('1', 18))
								const a = amount.sub(feeAmount)
								const minValue = a
									.div(100)
									.mul(slippageTol._isBigNumber ? Number(ethers.utils.formatUnits(slippageTol, 18)) : slippageTol)
									.sub(a)
									.mul(-1)
								minterBurn(
									value,
									minValue,
									minter,
									provider)
									.then((tx) => {
										tx.wait(
											defaults.network.tx.confirmations,
										).then((r) => {
											setReleaseTime(new Date().setSeconds(new Date().getSeconds() + (limits?.[3].toNumber() + ((1 / defaults.network.blockTime.second) * defaults.network.tx.confirmations))))
											locks?.refetch()
											locksComplete?.refetch()
											uniswapTWAP?.refetch()
											publicFee?.refetch()
											balance?.refetch()
											usdvMinted?.refetch()
											usdvBurnt?.refetch()
											setWorking(false)
											toast({
												...usdvredeemed,
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
										uniswapTWAP?.refetch()
										publicFee?.refetch()
										balance?.refetch()
										usdvMinted?.refetch()
										usdvBurnt?.refetch()
										setWorking(false)
										if (err.code === 4001) {
											console.log('Transaction rejected: You have decided to reject the transaction..')
											toast(rejected)
										}
										else {
											console.log(err)
											toast(failed)
										}
									})
							}
							else {
								toast(dailyLimitReached)
							}
						}
						else if(dailyLimitMint && dailyLimitMint.gt(0)) {
							setWorking(true)
							const feeAmount = uniswapTWAP?.data?.mul(fee).div(ethers.utils.parseUnits('1', 18))
							const amount = value?.mul(conversionFactor).div(ethers.utils.parseUnits('1', 18))
							const a = amount.sub(feeAmount)
							const minValue = a
								.div(100)
								.mul(slippageTol._isBigNumber ? Number(ethers.utils.formatUnits(slippageTol, 18)) : slippageTol)
								.sub(a)
								.mul(-1)
							minterMint(
								value,
								minValue,
								minter,
								provider)
								.then((tx) => {
									tx.wait(
										defaults.network.tx.confirmations,
									).then((r) => {
										setReleaseTime(new Date().setSeconds(new Date().getSeconds() + (limits?.[3].toNumber() + ((1 / defaults.network.blockTime.second) * defaults.network.tx.confirmations))))
										locks?.refetch()
										locksComplete?.refetch()
										uniswapTWAP?.refetch()
										publicFee?.refetch()
										usdvMinted?.refetch()
										usdvBurnt?.refetch()
										balance?.refetch()
										setWorking(false)
										toast({
											...vaderconverted,
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
									uniswapTWAP?.refetch()
									publicFee?.refetch()
									usdvMinted?.refetch()
									usdvBurnt?.refetch()
									setWorking(false)
									if (err.code === 4001) {
										console.log('Transaction rejected: You have decided to reject the transaction..')
										toast(rejected)
									}
									else {
										console.log(err)
										toast(failed)
									}
								})
						}
						else {
							toast(dailyLimitReached)
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
			else if (((submitOption) || (submitOption && !tokenApproved))) {
				if(releaseTime < now) {
					setWorking(true)
					const provider = new ethers.providers.Web3Provider(wallet.ethereum)
					usdvClaimAll(provider)
						.then((tx) => {
							tx.wait(
								defaults.network.tx.confirmations,
							).then((r) => {
								setReleaseTime(new Date().setSeconds(new Date().getSeconds() - ((1 / defaults.network.blockTime.second) * defaults.network.tx.confirmations)))
								locks.refetch()
								locksComplete.refetch()
								balance?.refetch()
								setWorking(false)
								toast({
									...vaderconverted,
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
								console.log('Transaction rejected: You have decided to reject the transaction..')
								toast(rejected)
							}
							else {
								console.log(err)
								toast(failed)
							}
						})
				}
				else {
					toast(notyetUnlocked)
				}
			}
			else if (tokenSelect.symbol === 'VETH' &&
			((!defaults.redeemables[0].snapshot[wallet.account]) ||
			(!Number(defaults.redeemables[0].snapshot[wallet.account]) > 0))) {
				toast(notBurnEligible)
			}
		}
	}

	useEffect(() => {
		if (wallet.account && defaults.redeemables[0].snapshot[wallet.account] &&
			Number(defaults.redeemables[0].snapshot[wallet.account]) > 0) {
			const leaf = getMerkleLeaf(wallet.account, defaults.redeemables[0].snapshot[wallet.account])
			getClaimed(leaf, defaults.network.provider)
				.then(r => {
					if(r) setVethAccountLeafClaimed(true)
				})
		}
	}, [wallet.account])

	useEffect(() => {
		if (tokenSelect.symbol === 'VETH') {
			setConversionFactor(
				ethers.BigNumber.from(String(defaults.vader.conversionRate)),
			)
		}
		else if (tokenSelect) {
			if(uniswapTWAP.data) setConversionFactor(uniswapTWAP.data)
		}
		return () => setConversionFactor(ethers.BigNumber.from('0'))
	}, [tokenSelect, uniswapTWAP.data, wallet.account])

	useEffect(() => {
		if(wallet.account && tokenSelect) {
			setWorking(true)
			getERC20Allowance(
				tokenSelect.address,
				wallet.account,
				tokenSelect.symbol === 'VETH' ? defaults.address.converter : tokenSelect.convertsTo.address,
				defaults.network.provider,
			).then((n) => {
				setWorking(false)
				if (tokenSelect.symbol !== 'VETH' && tokenSelect.symbol !== 'USDV') {
					if (n.gt(0)) setTokenApproved(true)
				}
				if (tokenSelect.symbol === 'USDV') {
					setTokenApproved(true)
				}
				if (tokenSelect.symbol === 'VETH') {
					if (n.eq(value)) {
						setTokenApproved(true)
					}
					else {
						setTokenApproved(false)
					}
				}
			})
		}
		return () => {
			setWorking(false)
			setTokenApproved(false)
		}
	}, [wallet.account,
		tokenSelect,
		(tokenSelect.symbol === 'VETH' ? value : ''),
	])

	useEffect(() => {
		if (tokenSelect.symbol === 'VETH') {
			if (defaults.redeemables[0].snapshot[wallet.account]) {
				if(!vethAllowLess && balance.data) {
					if (balance.data.gt(ethers.BigNumber.from(defaults.redeemables[0].snapshot[wallet.account]))) {
						setValue(ethers.BigNumber.from(defaults.redeemables[0].snapshot[wallet.account]))
						setInputAmount(
							ethers.utils.formatUnits(
								defaults.redeemables[0].snapshot[wallet.account],
								tokenSelect.decimals,
							))
					}
					else {
						setValue(balance.data)
						setInputAmount(ethers.utils.formatUnits(balance.data, tokenSelect.decimals))
					}
				}
			}
		}
	}, [wallet.account, tokenSelect, vethAllowLess])

	useEffect(() => {
		if (wallet.account) {
			getVester(wallet.account)
				.then((n) => {
					setVester(n)
				})
				.catch(err => console.log(err))
		}
	}, [wallet.account])

	return (
		<>
			<Box
				maxWidth={defaults.layout.container.sm.width}
				m='0 auto'
				p={{ base: '5rem .4rem 0', md: '5rem 0 0' }}
				{...props}
			>
				<Flex
					w='100%'
					maxW='49ch'
					m='0 auto'
					minH={{ base: 'auto', md: '478.65px' }}
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
            Burn to obtain assets.
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
								alt={`${tokenSelect.name} token`}
							/> : '' }
							rightIcon={<ChevronDownIcon />}
							onClick={() => {
								if (wallet.account) {
									onOpen()
									setIsSelect(0)
								}
								else {
									toast(walletNotConnected)
								}
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
									{!vethAccountLeafClaimed &&
									defaults.redeemables[0].snapshot[wallet.account] &&
									Number(defaults.redeemables[0].snapshot[wallet.account]) > 0 &&
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
										</>
									}

									{defaults.redeemables[0].snapshot[wallet.account] &&
										Number(defaults.redeemables[0].snapshot[wallet.account]) > 0 &&
										<Alert
											m='0 0 1rem'
											status='info'>
											<AlertIcon />
											<Box flex='1'>
												<AlertDescription>Vested portion&apos;s linearly released for 1&nbsp;year. Claiming has no limits. Can be done regularly at&nbsp;any time.</AlertDescription>
											</Box>
										</Alert>
									}

									{((!defaults.redeemables[0].snapshot[wallet.account]) ||
										(!Number(defaults.redeemables[0].snapshot[wallet.account]) > 0)) &&
										<Alert
											m='0 0 1rem'
											status='error'>
											<AlertIcon />
											<Box flex='1'>
												<AlertTitle mr={2}>Not eligible account</AlertTitle>
												<AlertDescription>Sorry, your account can not burn this token.</AlertDescription>
											</Box>
										</Alert>
									}

									{wallet.account &&
										defaults.redeemables[0].snapshot[wallet.account] &&
										Number(defaults.redeemables[0].snapshot[wallet.account]) > 0 &&
										<VethBreakdown claimable={claimableVeth} vethAccountLeafClaimed={vethAccountLeafClaimed} />
									}
								</>
							}

							{tokenSelect.symbol !== 'VETH' &&
								<>
									{uniswapTWAP &&
										publicFee &&
										!submitOption &&
											<Breakdown
												token={tokenSelect}
											/>
									}
									{submitOption &&
										<ClaimOverview
											token={tokenSelect}
											unclaimed={unclaimed}
											releaseTime={releaseTime}
											now={now}
										/>
									}
								</>
							}
						</>
					}

					{(!tokenSelect ||
						(tokenSelect.symbol === 'VETH' && !vethAccountLeafClaimed) ||
						(tokenSelect.symbol !== 'VETH')
					) &&
						<>
							<Text
								as='h4'
								fontSize='1.1rem'
								fontWeight='bolder'
								mr='0.66rem'
								opacity={
									!tokenSelect ? '0.5' :
										tokenSelect.symbol === 'VETH' && ((!defaults.redeemables[0].snapshot[wallet.account]) ||
										(!Number(defaults.redeemables[0].snapshot[wallet.account]) > 0)) ? '0.5' :
											tokenSelect.symbol === 'VETH' && !vethAllowLess ? '0.5' :
												tokenSelect !== 'VETH' && submitOption ? '0.5' :
													'1'
								}>
								Amount
							</Text>
							<Flex
								layerStyle='inputLike'
								cursor={
									!tokenSelect ? 'not-allowed' :
										tokenSelect.symbol === 'VETH' && ((!defaults.redeemables[0].snapshot[wallet.account]) ||
										(!Number(defaults.redeemables[0].snapshot[wallet.account]) > 0)) ? 'not-allowed' :
											tokenSelect.symbol === 'VETH' && !vethAllowLess ? 'not-allowed' :
												tokenSelect !== 'VETH' && submitOption ? 'not-allowed' :
													''
								}
								opacity={
									!tokenSelect ? '0.5' :
										tokenSelect.symbol === 'VETH' && ((!defaults.redeemables[0].snapshot[wallet.account]) ||
										(!Number(defaults.redeemables[0].snapshot[wallet.account]) > 0)) ? '0.5' :
											tokenSelect.symbol === 'VETH' && !vethAllowLess ? '0.5' :
												tokenSelect !== 'VETH' && submitOption ? '0.5' :
													'1'
								}
							>
								<Box flex='1'>
									<InputGroup>
										<Input
						  				variant='transparent'
											flex='1'
											disabled={
												!tokenSelect ? true :
													tokenSelect.symbol === 'VETH' && ((!defaults.redeemables[0].snapshot[wallet.account]) ||
													(!Number(defaults.redeemables[0].snapshot[wallet.account]) > 0)) ? true :
														tokenSelect.symbol === 'VETH' && !vethAllowLess ? true :
															tokenSelect !== 'VETH' && submitOption ? true :
																false
											}
											_disabled={{
												opacity: '0.5',
												cursor: 'not-allowed',
											}}
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
															if (tokenSelect.symbol === 'VETH' &&
															ethers.utils.parseUnits(String(e.target.value), 18).gt(defaults.redeemables?.[0].snapshot?.[wallet.account])) {
																setInputAmount(ethers.utils.formatUnits(defaults.redeemables?.[0].snapshot?.[wallet.account], 18))
																setValue(ethers.utils.parseUnits(defaults.redeemables?.[0].snapshot?.[wallet.account], 18))
																toast(nomorethaneligible)
															}
															else {
																setValue(ethers.utils.parseUnits(String(e.target.value), 18))
															}
														}
														catch(err) {
															if (err.code === 'NUMERIC_FAULT') {
																toast(tokenValueTooSmall)
															}
														}
													}
													else {
														setValue(ethers.BigNumber.from('0'))
													}
												}
											}}/>
										{tokenSelect && tokenSelect !== 'VETH' && !submitOption &&
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
															mr='5px'
															src={tokenSelect.logoURI}
															alt={`${tokenSelect.name} token`}
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

							{tokenSelect?.symbol !== 'VETH' &&
								<>
									<Flex
										mt='.6rem'
										justifyContent='flex-end'
										flexDir='row'
										opacity={
											(!tokenSelect || submitOption) ? '0.5' :
												'1'
										}
										pointerEvents={(!tokenSelect || submitOption) ? 'none' :
											''}
									>
										<Button
											variant='outline'
											size='sm'
											mr='0.4rem'
											onClick={() => {
												setInputAmount(
													ethers.utils.formatUnits(
														balance?.data?.div(100).mul(25),
														tokenSelect.decimals),
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
														tokenSelect.decimals),
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
														tokenSelect.decimals),
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
													ethers.utils.formatUnits(balance?.data, tokenSelect.decimals),
												)
												setValue(balance?.data)
											}}>
													MAX
										</Button>
									</Flex>
									<Flex
										m='.3rem 0 1.2rem'
										flexDir='column'
									>
										<Flex
											pointerEvents={(!tokenSelect || submitOption) ? 'none' :
												''}
											opacity={
												(!tokenSelect || submitOption) ? '0.5' :
													'1'
											}
											flexDir='column'
										>
											<Text
												as='h4'
												fontWeight='bolder'>
														Slippage Tolerance
											</Text>
											<Flex
												mt='.3rem'
												justifyContent='flex-start'
												flexDir='row'
											>
												<Button
													variant='outline'
													size='sm'
													mr='0.4rem'
													style={{
														border:	slippageTol === 2 && !slippageTolAmount ? '2px solid #3fa3fa' : '',
													}}
													onClick={() => {
														setSlippageTol(2)
														setSlippageTolAmount('')
													}}>
														2%
												</Button>
												<Button
													variant='outline'
													size='sm'
													mr='0.4rem'
													style={{
														border: slippageTol === 3 && !slippageTolAmount ? '2px solid #3fa3fa' : '',
													}}
													onClick={() => {
														setSlippageTol(3)
														setSlippageTolAmount('')
													}}>
														3%
												</Button>
												<Button
													variant='outline'
													size='sm'
													mr='0.4rem'
													style={{
														border: slippageTol === 4 && !slippageTolAmount ? '2px solid #3fa3fa' : '',
													}}
													onClick={() => {
														setSlippageTol(4)
														setSlippageTolAmount('')
													}}>
														4%
												</Button>
												<InputGroup
													size='sm'
												>
													<Input
														variant='outline'
														placeholder='Custom'
														style={{
															border: ((([2, 3, 4].indexOf(slippageTol) === -1)) || slippageTolAmount) ? '2px solid #3fa3fa' : '',
														}}
														value={slippageTolAmount}
														onChange={(e) => {
															if (isNaN(e.target.value)) {
																setSlippageTolAmount(prev => prev)
															}
															else {
																setSlippageTolAmount(String(e.target.value))
																if(Number(e.target.value) >= 0) {
																	try {
																		setSlippageTol(ethers.utils.parseUnits(String(e.target.value), tokenSelect.decimals))
																	}
																	catch(err) {
																		if (err.code === 'NUMERIC_FAULT') {
																			console.log('value too small')
																		}
																	}
																}
															}
														}}
													/>
													<InputRightElement>
														<>
															%
														</>
													</InputRightElement>
												</InputGroup>
											</Flex>
										</Flex>
									</Flex>
									<SubmitOptions
										pointerEvents={!tokenSelect ? 'none' :
											''}
										opacity={
											!tokenSelect ? '0.5' :
												'1'
										}
										set={setSubmitOption}
										setting={submitOption}
									/>
								</>
							}

							{tokenSelect && tokenSelect.symbol === 'VETH' &&
								<VethAllowLessOption
									allow={vethAllowLess}
									setAllow={setVethAllowLess}/>
							}
						</>
					}

					<Flex
						m='1.66rem 0'
						fontSize={{ base: '1.35rem', md: '1.5rem' }}
						fontWeight='bolder'
						justifyContent='center' alignItems='center' flexDir='column'>
						{tokenSelect.symbol === 'VETH' &&
									<>
										{!vethAccountLeafClaimed &&
										<>
											{inputAmount && defaults.redeemables[0].snapshot[wallet.account] &&
												Number(defaults.redeemables[0].snapshot[wallet.account]) > 0 &&
												<>
													{prettifyCurrency(
														(Number(inputAmount) * Number(conversionFactor)) / 2,
														0,
														2,
														tokenSelect.convertsTo.symbol,
													)}
												</>
											}
										</>
										}
										{vethAccountLeafClaimed &&
											<>
												{prettifyCurrency(
													ethers.utils.formatUnits(claimableVeth, 18),
													0,
													2,
													'VADER',
												)}
											</>
										}
									</>
						}
						{tokenSelect && tokenSelect?.symbol !== 'VETH' && !!uniswapTWAP?.data &&
									<>
										{!!uniswapTWAP?.data && conversionFactor?.gt(0) &&
											<>
												{inputAmount && !submitOption &&
													<>
														{prettifyCurrency(
															tokenSelect?.symbol === 'USDV' ?
																(ethers.utils.formatEther(
																	(value?.mul(usdcTWAP).div(ethers.utils.parseUnits('1', 18)))
																		.sub(usdcTWAP?.mul(fee).div(ethers.utils.parseUnits('1', 18))),
																)) :
																(ethers.utils.formatEther(
																	value?.mul(conversionFactor)
																		.div(ethers.utils.parseUnits('1', 18))
																		.sub(
																			uniswapTWAP?.data?.mul(fee)
																				.div(ethers.utils.parseUnits('1', 18)),
																		),
																)),
															0,
															2,
															tokenSelect?.convertsTo?.symbol,
														)}
													</>
												}
											</>
										}
										{submitOption && unclaimed.gt(0) &&
											<>
												{prettifyCurrency(ethers.utils.formatEther(unclaimed), 0, 2, tokenSelect.symbol)}
											</>
										}
									</>
						}

						{(!claimableVeth.gt(0)) && (
							(!tokenSelect) ||
							(!inputAmount && !submitOption) ||
							(!uniswapTWAP?.data) ||
							(!unclaimed.gt(0) && submitOption)
						) &&
							<>
								<span>👻</span>
							</>
						}
						<WhatYouGetTag/>
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
									{!working && tokenSelect && tokenSelect.symbol !== 'VETH' &&
										<>
											{!tokenApproved &&
												<>
													{submitOption &&
														<>Claim</>
													}
													{!submitOption &&
														<>Approve {tokenSelect.symbol}</>
													}
												</>
											}
											{tokenApproved &&
												<>
													{submitOption &&
														<>Claim</>
													}
													{!submitOption &&
														<>Burn</>
													}
												</>
											}
										</>
									}
									{!working && tokenSelect && tokenSelect.symbol === 'VETH' &&
										<>
											{!tokenApproved && defaults.redeemables[0].snapshot[wallet.account] &&
											Number(defaults.redeemables[0].snapshot[wallet.account]) > 0 &&
											!vethAccountLeafClaimed &&
												<>
													Approve {tokenSelect.symbol}
												</>
											}
											{!tokenApproved && ((!defaults.redeemables[0].snapshot[wallet.account]) ||
													(!Number(defaults.redeemables[0].snapshot[wallet.account]) > 0)) &&
														<>
															Burn
														</>
											}
											{vethAccountLeafClaimed && defaults.redeemables[0].snapshot[wallet.account] &&
												Number(defaults.redeemables[0].snapshot[wallet.account]) > 0 &&
													<>
														Claim
													</>
											}
											{tokenApproved && !vethAccountLeafClaimed &&
												<>
													Burn
												</>
											}
										</>
									}
									{!working && !tokenSelect &&
										<>
											Burn
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
				tokenList={(((!defaults.redeemables[0].snapshot[wallet.account]) ||
					(!Number(defaults.redeemables[0].snapshot[wallet.account]) > 0)) ? defaults.redeemables.slice(1) : defaults.redeemables)}
				isOpen={isOpen}
				onOpen={onOpen}
				onClose={onClose}
			/>
		</>
	)
}

const WhatYouGetTag = () => {
	return (
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
			>What You Get
			</Badge>
		</Box>
	)
}

const ClaimOverview = (props) => {

	ClaimOverview.propTypes = {
		token: PropTypes.object.isRequired,
		unclaimed: PropTypes.object.isRequired,
		releaseTime: PropTypes.object.isRequired,
		now: PropTypes.object.isRequired,
	}

	return (
		<Flex
			flexDir='column'
			justifyContent='center'
			minH='141.6px'
		>
			<Text
				as='h4'
				fontSize='1.1rem'
				fontWeight='bolder'
				mr='0.66rem'
			>
				Overview
			</Text>

			<Flex
				flexDir='column'
				p='0 0.15rem'
				marginBottom='.7rem'
				opacity='0.87'
			>
				<Flex>
					<Container p='0'>
						<Box
							textAlign='left'
						>
							Total unclaimed
						</Box>
					</Container>
					<Container p='0'>
						<Box
							textAlign='right'
						>
							{prettifyCurrency(ethers.utils.formatEther(props.unclaimed), 0, 2, props.token.symbol)}
						</Box>
					</Container>
				</Flex>
				<Flex>
					<Container p='0'>
						<Box
							textAlign='left'>
								Time to unlock
						</Box>
					</Container>
					<Container p='0'>
						<Box
							textAlign='right'>
							{props.releaseTime >= props.now &&
								<TimeAgo date={props.releaseTime} live={false}/>
							}
							{props.releaseTime < props.now &&
								<i>None left</i>
							}
						</Box>
					</Container>
				</Flex>
				<Flex>
					<Container
						maxW='none'
						mt='4px'
						p='0'>
						<Tag
							size='md'
							colorScheme={props.releaseTime < props.now ? 'cyan' : 'red'}
							borderRadius='full'>
							<TagLeftIcon
								as={props.releaseTime < props.now ? CheckCircleIcon : BsPauseCircleFill}/>
							<TagLabel>{props.releaseTime < props.now ? 'Unlocked' : 'Locked'}</TagLabel>
						</Tag>
					</Container>
				</Flex>
			</Flex>
		</Flex>
	)
}

const Breakdown = (props) => {

	Breakdown.propTypes = {
		token: PropTypes.object.isRequired,
	}

	const uniswapTWAP = useUniswapTWAP()
	const publicFee = usePublicFee()
	const { data: limits } = useMinterDailyLimits()

	const usdvMinted = useUsdvMintedBurnt()

	const dailyLimitMint = usdvMinted?.data?.globals?.[0]?.value && limits?.[1].gt(0) ?
		ethers.BigNumber.from(usdvMinted?.data?.globals?.[0]?.value).sub(ethers.BigNumber.from('2498987256675690868874746')).lt(limits?.[1]) ?
			limits?.[1].sub(ethers.BigNumber.from(usdvMinted?.data?.globals?.[0]?.value).sub(ethers.BigNumber.from('2498987256675690868874746'))) :
			ethers.BigNumber.from(usdvMinted?.data?.globals?.[0]?.value).sub(ethers.BigNumber.from('2498987256675690868874746')).eq(limits?.[1]) ?
				ethers.BigNumber.from('0') : ethers.BigNumber.from('0') : ethers.BigNumber.from('0')

	const usdvBurnt = useUsdvMintedBurnt(true)
	const dailyLimitBurnt = usdvBurnt?.data?.globals?.[0]?.value && limits?.[2]?.gt(0) ?
		ethers.BigNumber.from(usdvBurnt?.data?.globals?.[0]?.value).lt(limits?.[2]) ?
			limits?.[2].sub(ethers.BigNumber.from(usdvBurnt?.data?.globals?.[0]?.value)) :
			ethers.BigNumber.from(usdvBurnt?.data?.globals?.[0]?.value).eq(limits?.[2]) ?
				ethers.BigNumber.from('0') : ethers.BigNumber.from('0') : ethers.BigNumber.from('0')

	return (
		<>
			<Text
				as='h4'
				fontSize='1.1rem'
				fontWeight='bolder'
				mr='0.66rem'
			>
				Breakdown
			</Text>

			<Flex
				flexDir='column'
				p='0 0.15rem'
				marginBottom='.7rem'
				opacity='0.87'
			>
				<Flex>
					<Container p='0'>
						<Box
							textAlign='left'
						>
							TWAP
						</Box>
					</Container>
					<Container p='0'>
						<Box
							textAlign='right'
						>
							{uniswapTWAP.data &&
								<>
									{prettifyCurrency(
										ethers.utils.formatUnits(
											props.token.symbol === 'USDV' ?
												ethers.utils.parseEther(
													String(
														1 /
														Number(ethers.utils.formatUnits(uniswapTWAP?.data, 18)),
													),
												) : uniswapTWAP?.data,
											props.token.decimals),
										0,
										props.token.symbol === 'USDV' ? 5 : 2,
										props.token.convertsTo.symbol,
									)}
								</>
							}
						</Box>
					</Container>
				</Flex>
				<Flex>
					<Container p='0'>
						<Box
							textAlign='left'>
								Fee
						</Box>
					</Container>
					<Container p='0'>
						<Box
							textAlign='right'>
							{publicFee?.data &&
								<>
									{getPercentage(Number(publicFee?.data ? publicFee?.data * 0.0001 : 0), 0, 2)}
								</>
							}
						</Box>
					</Container>
				</Flex>
				<Flex>
					<Container p='0'>
						<Box
							textAlign='left'>
								Remaining daily limit
						</Box>
					</Container>
					<Container p='0'>
						<Box
							textAlign='right'>
							{props.token.symbol === 'VADER' &&
								<>
									{limits?.[1] && dailyLimitMint &&
										<>
											{prettifyCurrency(ethers.utils.formatUnits(dailyLimitMint ? dailyLimitMint : 0, 18), 0, 2, 'USDV')}
										</>
									}
								</>
							}
							{props.token.symbol === 'USDV' &&
								<>
									{limits?.[2] && dailyLimitBurnt &&
										<>
											{prettifyCurrency(ethers.utils.formatUnits(dailyLimitBurnt ? dailyLimitBurnt : 0, 18), 0, 2, 'USDV')}
										</>
									}
								</>
							}
						</Box>
					</Container>
				</Flex>
				<Flex>
					<Container p='0'>
						<Box
							textAlign='left'>
								Lock duration
						</Box>
					</Container>
					<Container p='0'>
						<Box
							textAlign='right'>
							{limits?.[3] &&
								<>
									{limits?.[3]?.toString() ? prettyMilliseconds(
										limits?.[3]?.toNumber() * 1000,
										{ verbose: true }) : ''}
								</>
							}
						</Box>
					</Container>
				</Flex>
			</Flex>
		</>
	)
}

const VethBreakdown = (props) => {

	VethBreakdown.propTypes = {
		claimable: PropTypes.object.isRequired,
		vethAccountLeafClaimed: PropTypes.bool.isRequired,
	}

	const wallet = useWallet()
	const [vester, setVester] = useState([])

	useEffect(() => {
		if (wallet.account) {
			getVester(wallet.account)
				.then((n) => {
					setVester(n)
				})
				.catch(err => console.log(err))
		}
	}, [wallet.account])

	return (
		<>
			<Text
				as='h4'
				fontSize='1.1rem'
				fontWeight='bolder'
				mr='0.66rem'
			>
				Breakdown
			</Text>

			<Flex
				flexDir='column'
				p='0 0.15rem'
				marginBottom='.7rem'
				opacity='0.87'
			>

				{!props.vethAccountLeafClaimed &&
					<Flex>
						<Container p='0'>
							<Box
								textAlign='left'
							>
							Total eligible
							</Box>
						</Container>
						<Container p='0'>
							<Box
								textAlign='right'
							>
								{wallet.account && defaults.redeemables[0].snapshot[wallet.account] &&
							Number(defaults.redeemables[0].snapshot[wallet.account]) > 0 &&
								<>
									{prettifyCurrency(
										(ethers.utils.formatUnits(defaults.redeemables[0].snapshot[wallet.account], 18) * defaults.vader.conversionRate), 0, 5, 'VADER')
									}
								</>
								}
							</Box>
						</Container>
					</Flex>
				}

				{wallet.account && vester?.[0] && defaults.redeemables[0].snapshot[wallet.account] &&
							Number(defaults.redeemables[0].snapshot[wallet.account]) > 0 && props.vethAccountLeafClaimed &&
								<>
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
												{prettifyCurrency(
													Number(ethers.utils.formatUnits(defaults.redeemables[0].snapshot[wallet.account], 18) * defaults.vader.conversionRate)
											- Number(ethers.utils.formatUnits(vester?.[0], 18)),
													0,
													5,
								 		'VADER',
												)}
											</Box>
										</Container>
									</Flex>
								</>
				}

				{wallet.account && props.claimable && vester?.[0] && defaults.redeemables[0].snapshot[wallet.account] &&
							Number(defaults.redeemables[0].snapshot[wallet.account]) > 0 && props.vethAccountLeafClaimed &&
								<>
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
												{vester?.[0] &&
													<>
														{prettifyCurrency(
															ethers.utils.formatUnits(
																vester?.[0]?.sub(props.claimable), 18), 0, 4, 'VADER',
														)}
													</>
												}
											</Box>
										</Container>
									</Flex>
								</>
				}

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
							{props.claimable.gte(0) && props.vethAccountLeafClaimed &&
								<>
									{prettifyCurrency(
										ethers.utils.formatUnits(props.claimable, 18),
										0,
										5,
										'VADER',
									)}
								</>
							}
							{props.claimable?.lte(0) && !props.vethAccountLeafClaimed &&
								<>
									{prettifyCurrency(
										((Number(ethers.utils.formatUnits(defaults.redeemables?.[0]?.snapshot[wallet.account], 18) * defaults.vader.conversionRate)) / 2),
										0,
										5,
										'VADER',
									)}
								</>
							}
						</Box>
					</Container>
				</Flex>
			</Flex>
		</>
	)
}
const RadioCard = (props) => {

	RadioCard.propTypes = {
		children: PropTypes.any,
		set: PropTypes.func.isRequired,
		setting: PropTypes.bool.isRequired,
		pointerEvents: PropTypes.string,
	}

	const { getInputProps, getCheckboxProps } = useRadio(props)
	const input = getInputProps()
	const checkbox = getCheckboxProps()

	return (
		<>
			<Box as='label' width='100%'>
				<input {...input}/>
				<Box
					{...checkbox}

					borderWidth='1px'
					borderRadius='12px'
					fontWeight='600'
					textAlign='center'
					cursor='pointer'
					pointerEvents={props.pointerEvents}
					_hover={{
						background: 'rgba(255,255,255, 0.08)',
					}}
					_checked={{
						color: 'bluish.300',
						borderColor: 'bluish.300',
						borderWidth: '2px',
					}}
					p='0.75rem 1.25rem'
				>
					{props.children}
				</Box>
			</Box>
		</>
	)
}

const SubmitOptions = (props) => {

	SubmitOptions.propTypes = {
		set: PropTypes.func.isRequired,
		setting: PropTypes.bool.isRequired,
		opacity: PropTypes.string,
		pointerEvents: PropTypes.string,
	}

	const options = ['Burn', 'Claim']

	const { getRootProps, getRadioProps } = useRadioGroup({
		name: 'action',
		value: !props.setting ? 'Burn' : 'Claim',
		onChange: () => props.set(!props.setting),
	})
	const group = getRootProps()

	return (
		<HStack
			{...group}
			mt='0.7rem'
			lineHeight='normal'
			opacity={props.opacity}
			pointerEvents={props.pointerEvents}
		>
			{options.map((value) => {
				const radio = getRadioProps({ value })
				return (
					<RadioCard
						set={props.set}
						setting={props.setting}
						key={value} {...radio}>
						{value}
					</RadioCard>
				)
			})}
		</HStack>
	)
}

const VethAllowLessOption = (props) => {

	VethAllowLessOption.propTypes = {
		allow: PropTypes.bool.isRequired,
		setAllow: PropTypes.func.isRequired,
	}

	const wallet = useWallet()
	const [isOpen, setIsOpen] = useState(false)
	const onClose = () => setIsOpen(false)
	const cancelRef = useRef()

	return (
		<>
			<Box
				maxW='236.95px'
				mt='0.7rem'
				lineHeight='normal'
				onClick={() => {
					if(defaults.redeemables[0].snapshot[wallet.account] && Number(defaults.redeemables[0].snapshot[wallet.account]) > 0) {
						if(!props.allow) {
							setIsOpen(true)
						}
					}
				}}
			>
				<Checkbox
					maxW='236.95px'
					colorScheme='pink'
					size='lg'
					disabled={((!defaults.redeemables[0].snapshot[wallet.account]) || (!Number(defaults.redeemables[0].snapshot[wallet.account]) > 0))}
					isChecked={props.allow}
					onChange={() => {
						if(props.allow === true) {
							props.setAllow(false)
						}
					}}
				>
					Allow me to adjust amount
				</Checkbox>
			</Box>

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
							This&nbsp;might result in loss of potential claim portion.
							Please note that it&apos;s neccesary to re-approve if you already did so.
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
