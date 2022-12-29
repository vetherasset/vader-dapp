import React, { useEffect, useState } from 'react'
import {
	Box,
	Flex,
	Text,
	Button,
	Icon,
	Spinner,
	useToast,
	RadioGroup,
	Stack,
	Radio,
} from '@chakra-ui/react'
import defaults from '../common/defaults'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { BsFillXCircleFill, BsQuestionCircle } from 'react-icons/bs'
import { useWallet } from 'use-wallet'
import { failed, rejected, walletNotConnected } from '../messages'
import { useTreasuryClaimed } from '../hooks/useTreasuryClaimed'
import { useTreasuryHasClaim } from '../hooks/useTreasuryHasClaim'
import { treasuryClaim } from '../common/ethereum'
import { getMerkleProofForAccount } from '../common/utils'
import usdv from '../artifacts/json/treasuryMap/usdv'
import vader from '../artifacts/json/treasuryMap/vader'
import { ethers } from 'ethers'

const Redeem = (props) => {

	const wallet = useWallet()
	const toast = useToast()
	const { data: claimed } = useTreasuryClaimed(wallet.account)
	const hasClaim = useTreasuryHasClaim(wallet.account)
	const [asset, setAsset] = useState(true)
	const [working, setWorking] = useState(false)

	const iconSize = {
		boxSize: '1.33rem',
		marginTop: '2px',
	}

	const submit = () => {
		if(!working) {
			if (wallet.account &&
				hasClaim > 0 &&
				!claimed) {
				setWorking(true)
				const provider = new ethers.providers.Web3Provider(wallet.ethereum)
				const salt = '123456789'
				let amount0 = ''
				let amount1 = ''
				let proof0 = []
				let proof1 = []
				if (hasClaim === 1 ||
					hasClaim > 2) {
					amount0 = Object.entries(usdv)
						.find(entry => entry.includes(wallet.account))
						.at(1)
					proof0 = getMerkleProofForAccount(wallet.account, usdv, salt)
				}
				if (hasClaim > 1) {
					amount1 = Object.entries(vader)
						.find(entry => entry.includes(wallet.account))
						.at(1)
					proof1 = getMerkleProofForAccount(wallet.account, vader, salt)
				}
				treasuryClaim(
					wallet.account,
					asset ? amount1 : amount0,
					asset ? proof1 : proof0,
					asset ? '0xF5644345A5A9dc14076b58802DC908B83E62B0E1' :
						'0x78e7EEadCb7489518bF88eB72352f6D232a2ad9fcd',
					provider)
					.then((tx) => {
						tx.wait(
							defaults.network.tx.confirmations,
						).then((r) => {
							setWorking(false)
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
			if(!wallet.account) {
				toast(walletNotConnected)
			}
		}
	}

	useEffect(() => {
		if (hasClaim === 1) setAsset(false)
		if (hasClaim === 2) setAsset(true)
	},
	[hasClaim])

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
					m='0 auto'r
					minH={{ base: '588.617px' }}
					p={{ base: '2rem 0.9rem', md: '2rem 2.6rem' }}
					layerStyle='colorful'
					flexDir='column'
					justifyContent='space-between'
				>
					<Flex
						flexDir='column'
					>
						<Text
							align='center'
							fontSize={{ base: '1.25rem', md: '1.55rem' }}
							fontWeight='bolder'
						>
        	    Redeem
						</Text>
						<Text
							align='center'
							fontSize={{ base: '0.91rem', md: '1.12rem' }}
							display='block'
						>
            	Claim a treasury share.
						</Text>
					</Flex>
					<Flex
						flexDirection='column'
						gap='2.7rem'
					>
						<Flex
							flexDir='column'
							gap='1rem'
						>
							<Flex
								flexDir='row'
								gap='.7rem'
							>
								{!wallet.account &&
									<>
										<Icon
											as={BsQuestionCircle}
											boxSize='1.33rem'
											marginTop='3px'/>
										<Box as='span'>Connect your wallet account to check eligibility.</Box>
									</>
								}
								{wallet.account &&
									<>
										{hasClaim > 0 && !claimed &&
											<>
												<Icon
													color='#6fc2ff'
													as={CheckCircleIcon}
													{...iconSize}/>
												<Box as='span'>You can claim a portion of the protocol treasury with your wallet account.</Box>
											</>
										}
										{hasClaim < 1 &&
											<>
												<Icon
													as={BsFillXCircleFill}
													color='#ff9292'
													{...iconSize}/>
												<Box>
													There are no claimable shares for your wallet account.
												</Box>
											</>
										}
									</>
								}
								{claimed && hasClaim < 3 &&
									<>
										<Icon
											color='#6fc2ff'
											as={CheckCircleIcon}
											{...iconSize}/>
										<Box as='span'>Treasury share has already been claimed.</Box>
									</>
								}
							</Flex>
							<Flex
								flexDir='column'
							>
								{hasClaim > 2 &&
									<>
										<RadioGroup
											value={asset ? 0 : 1}
											onChange={() => setAsset(!asset)}
										>
											<Stack>
												<Radio
													size='md'
													name='what'
													value={0}
												>
													Claim share from VADER holdings
												</Radio>
												<Radio
													size='md'
													value={1}
												>
													Claim share from USDV holdings
												</Radio>
											</Stack>
										</RadioGroup>
									</>
								}
							</Flex>
						</Flex>
					</Flex>
					<Button
						variant='solidRadial'
						m='0 auto 2rem'
						size='lg'
						minWidth='230px'
						textTransform='uppercase'
						disabled={(working ||
							(claimed && hasClaim < 3))}
						onClick={() => submit()}
					>
						{!working &&
							<>
								Claim
							</>
						}
						{working &&
							<>
								<Spinner />
							</>
						}
					</Button>
				</Flex>
			</Box>
		</>
	)
}

export default Redeem
