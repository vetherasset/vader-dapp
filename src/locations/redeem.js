import React, { useState } from 'react'
import {
	Box,
	Flex,
	Text,
	Button,
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
	const hasClaim = useTreasuryHasClaim(wallet.account)
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
													There are no claimable shares for your wallet account.
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
