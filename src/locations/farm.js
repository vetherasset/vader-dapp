import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
	Box, Button, Flex, Text, Tab, TabList, Tabs, TabPanels, TabPanel, NumberInput, NumberInputField,
	InputGroup, InputRightElement, useToast, Image, Container, Heading, Badge, Link,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import defaults from '../common/defaults'
import { useWallet } from 'use-wallet'
import { ethers } from 'ethers'

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
				<AccordionItem>
					<h2>
						<AccordionButton _expanded={{ bg: 'rgb(131, 90, 129)', color: '#fff' }}>
							<Box flex="1" textAlign="left" color="white" fontWeight='bolder'>
								USDC-3CRV LP
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
								<DetailSection></DetailSection>
							</Flex>
							<Flex
								w='77.777%'
								minH='478.65px'
								m='0 auto'
								p='0 0 2rem'
								layerStyle='colorful'
								flexDir='column'
							>
								<LPStaking></LPStaking>
							</Flex>
						</Flex>
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem>
					<h2>
						<AccordionButton _expanded={{ bg: 'rgb(131, 90, 129)', color: '#fff' }}>
							<Box flex="1" textAlign="left" color="white" fontWeight='bolder'>
								DAI-VADER LP
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
						tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
						veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
						commodo consequat.
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
		</Box>
	)
}
const LPStaking = props => {
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
						/>
					</TabPanel>
					<TabPanel p='0'>
						<UnstakePanel
						/>
					</TabPanel>
					<TabPanel p='0'>
						<ClaimPanel
						/>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</>
	)
}

const DetailSection = (props) => {
	return (
		<>
			<Flex>
				<Container mb='23px' p='0'>
					<Heading as='h1' size='md'>EARN ADDITIONAL VADER.</Heading>
					<Box as='p' mb='0.65rem'>Stake your <i>LP-Token</i> for <i>VADER</i> and maximize your yield. No&nbsp;Impermanent Loss.</Box>
					<Box as='p' mb='23px'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur consequat hendrerit lorem, euismod scelerisque leo sodales eu. </Box>
					<Heading as='h1' size='md'>GET LP-Token</Heading>
					<Link href="https://curve.fi/3pool" isExternal>
						From Curve <ExternalLinkIcon mx="2px" />
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
					<Box>
						1000 VADER/WEEK
					</Box>
				</Container>
			</Flex>
			<Flex>
				<Container p='0'>
					AVAILABLE IN WALLET
				</Container>
				<Container p='0'>
					<Box textAlign='left'>
						10000 USDC-3CRV LP
					</Box>
				</Container>
			</Flex>
			<Flex>
				<Container p='0'>
					TOTAL STAKED
				</Container>
				<Container p='0'>
					<Box textAlign='left'>
						20000 USDC-3CRV LP
					</Box>
				</Container>
			</Flex>
			<Flex>
				<Container p='0'>
					CLAIMABLE REWARDS
				</Container>
				<Container p='0'>
					<Box textAlign='left'>
						100 VADER
					</Box>
				</Container>
			</Flex>
		</>
	)
}

const StakePanel = (props) => {
	const tokenSelect = defaults.stakeable[0]
	const amount = '100'
	const handleChange = () => {}
	return (
		<>
			<Flex
				mt='4.2rem'
				flexDir='column'>
				<Flex alignItems="center" justifyContent="space-between">
					<Text as='h4' fontSize='1.24rem' fontWeight='bolder'>Amount</Text>
					<Text>10000</Text>
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
							STAKE
						</Text>
					</Button>
				</Flex>
			</Flex>
		</>
	)
}

const UnstakePanel = props => {
	const tokenSelect = defaults.stakeable[0]
	const amount = '100'
	const handleChange = () => { }
	return (
		<>
			<Flex
				mt='4.2rem'
				flexDir='column'>
				<Flex alignItems="center" justifyContent="space-between">
					<Text as='h4' fontSize='1.24rem' fontWeight='bolder'>Amount</Text>
					<Text>20000</Text>
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
							UNSTAKE
						</Text>
					</Button>
				</Flex>
			</Flex>
		</>
	)
}

const ClaimPanel = props => {
	const tokenSelect = defaults.stakeable[0]
	const amount = '100'
	const handleChange = () => {}
	return (
		<>
			<Flex
				mt='4.2rem'
				flexDir='column'>
				<Flex alignItems="center" justifyContent="space-between">
					<Text as='h4' fontSize='1.24rem' fontWeight='bolder'>Amount</Text>
					<Text>100</Text>
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
