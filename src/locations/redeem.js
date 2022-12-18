import React, { useState } from 'react'
import {
	Box,
	Flex,
	Text,
	Button,
	Input,
	InputGroup,
	Icon,
	Spinner,
	useToast,
} from '@chakra-ui/react'
import defaults from '../common/defaults'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { BsFillXCircleFill, BsQuestionCircle } from 'react-icons/bs'
import { useWallet } from 'use-wallet'
import { walletNotConnected } from '../messages'
import { useTreasuryClaimed } from '../hooks/useTreasuryClaimed'
import { useTreasuryHasClaim } from '../hooks/useTreasuryHasClaim'
import { treasuryClaim } from '../common/ethereum'

const Burn = (props) => {

	const wallet = useWallet()
	const toast = useToast()
	const { data: claimed } = useTreasuryClaimed()
	const [address, setAddress] = useState('0x00000000003b3cc22aF3aE1EAc0440BcEe416B40')
	const hasClaim = useTreasuryHasClaim(address ? address : undefined)
	const [working, setWorking] = useState(false)

	const iconSize = {
		boxSize: '1.33rem',
		marginTop: '2px',
	}

	const submit = () => {
		if(!working) {
			if (wallet.account &&
				!claimed) {
				treasuryClaim(wallet.account)
			}
			if(!wallet.account) {
				toast(walletNotConnected)
			}
		}
	}

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
										<Box as='span'>Connect your wallet account or enter adddres below to check eligibility.</Box>
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
													There are no claimable shares for your wallet account.<br/>
													You can still make a claim for another one, though.
												</Box>
											</>
										}
									</>
								}
								{claimed &&
									<>
										<Icon
											color='#6fc2ff'
											as={CheckCircleIcon}
											{...iconSize}/>
										<Box as='span'>Treasury share has already been claimed.</Box>
									</>
								}
							</Flex>
						</Flex>
						<Flex
							m='0 0 1.2rem'
							flexDir='column'
						>
							<Flex
								flexDir='column'
							>
								<Text
									as='h4'
									fontWeight='bolder'>
									Claim for account
								</Text>
								<Flex
									mt='.3rem'
									justifyContent='flex-start'
									flexDir='row'
								>
									<InputGroup
										size='sm'
									>
										<Input
											variant='outline'
											placeholder='Address'
											value={address}
											onChange={(e) => {
												const regex = new RegExp('^[a-fA-F0-9]+$')
												const val = String(e.target.value)
												if (val.length > 42 ||
												val.length === 1 && val.slice(0, 1) !== '0' ||
												val.length === 2 && val.slice(0, 2) !== '0x' ||
												val.length > 2 && regex.test(val.substring(2)) === false
												) {
													setAddress(prev => prev)
												}
												else {
													setAddress(String(e.target.value))
												}
											}}
										/>
									</InputGroup>
								</Flex>
							</Flex>
						</Flex>
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

export default Burn
