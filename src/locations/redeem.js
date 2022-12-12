import React, { useState } from 'react'
import {
	Box,
	Badge,
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

const Burn = (props) => {

	const wallet = useWallet()
	const toast = useToast()
	const [address, setAddress] = useState('')
	const [eligible, setEligible] = useState(false)
	const [working, setWorking] = useState(false)

	const iconSize = {
		boxSize: '1.33rem',
		marginTop: '2px',
	}

	const submit = () => {
		if(!working) {
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
					minH={{ base: 'auto', md: '588.617px' }}
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
									{eligible &&
										<>
											<Icon
												color='#6fc2ff'
												as={CheckCircleIcon}
												{...iconSize}/>
											<Box as='span'>Your wallet account is eligible to claim proportional amount of the protocol treasury.</Box>
										</>
									}
									{!eligible &&
										<>
											<Icon
												as={BsFillXCircleFill}
												color='#ff9292'
												{...iconSize}/>
											<Box>
												Your wallet account is not eligible to claim.
											</Box>
										</>
									}
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
							{wallet.account && !eligible &&
								<>
									However, you can still trigger claim for other one.
								</>
							}
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
