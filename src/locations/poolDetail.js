import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Button, Flex, NumberInput, NumberInputField, Text, Image } from '@chakra-ui/react'
import { TriangleDownIcon, AddIcon, ArrowBackIcon } from '@chakra-ui/icons'
import { BsCheckLg } from 'react-icons/bs'
import defaults from '../common/defaults'

const flex = {
	flex: '1',
}

const input = {
	variant: 'transparent',
}

const field = {
	fontSize: '1.3rem',
	fontWeight: 'bold',
}

const PoolDetail = (props) => {

	return (
		<Box
			height={`calc(100vh - ${defaults.layout.header.minHeight})`}
			maxWidth={defaults.layout.container.md.width}
			m='0 auto'
			p={{ base: '5rem 1.2rem 0', md: '5rem 0 0' }}
			{...props}
		>
			<Flex
				m='0 auto'
				p='1.8rem'
				flexDir='column'
				layerStyle='colorful'
				height='auto'
			>
				<Flex
					{...flex}
					flexDir='row'
					justifyContent='space-between'
					alignItems='first baseline'
				>
					<Link
						to='/pool'
					>
						<Button
							variant='ghost'
							minW='auto'
							width='32px'
							height='32px'
							p='0'
						>
							<ArrowBackIcon
								width='26px'
								height='26px'
							/>
						</Button>
					</Link>
					<Box as='h3' fontSize='1.3rem' fontWeight='bold' textTransform='capitalize' ml='1rem'>DAI / USDC</Box>
				</Flex>

				<Flex
					flexWrap={{ base: 'wrap', md: 'nowrap' }}
				>
					<Flex
						p='0 0.3rem'
						flexDir='column'
						justifyContent='center'
						alignItems='center'
						width={{ base: '100%', md: '46.5%' }}
						mt={{ base: '1rem', md: '0' }}
						mb={{ base: '2rem', md: '0' }}
					>
						<BsCheckLg
							style={{
								height: 'auto',
								width: '9.5rem',
								color: '#ff9ddb87',
								marginBottom: '2rem' }}
						/>
						<Text fontSize='1.1rem'>You&lsquo;re currently providing no liquidity.</Text>
						<Text fontSize='1.1rem' color='#e3b2db' fontStyle='italic'>Go ahead, add some!</Text>
					</Flex>
					<Flex
						p='0 0.3rem'
						flexDir='column'
						width={{ base: '100%', md: '54.5%' }}
					>
						<Text
							as='h4'
							fontSize='1.24rem'
							fontWeight='bolder'>
						Add Liquidity
						</Text>
						<Text
							as='h4'
							fontSize='1.1rem'
							fontWeight='bolder'
							mr='0.66rem'>
							Amounts
						</Text>
						<Flex layerStyle='inputLike'>
							<Box flex='1' pr='0.5rem'>
								<NumberInput {...flex} {...input}>
									<NumberInputField placeholder='0.0' {...field}/>
								</NumberInput>
							</Box>
							<Box
								as='button'
								display='inline-flex'
								minWidth='23px'
								alignItems='center'
							>
								<Image
									width='23px'
									height='23px'
									borderRadius='50%'
									objectFit='none'
									background='#fff'
									mr='10px'
								/>
								<Box as='span' fontWeight='bold' alignSelf='center' mr='5px'>DAI</Box>
								<TriangleDownIcon
									alignSelf='center'
									height='0.7rem'
									marginTop='1px'
								/>
							</Box>
						</Flex>

						<Box
							m='1rem 0.6rem'
							width='22px'
							alignSelf='center'
						>
							<AddIcon m='0' height='22px' />
						</Box>

						<Flex layerStyle='inputLike'>
							<Box flex='1' pr='0.5rem'>
								<NumberInput {...flex} {...input}>
									<NumberInputField placeholder='0.0' {...field}/>
								</NumberInput>
							</Box>
							<Box
								as='button'
								display='inline-flex'
								minWidth='23px'
								alignItems='center'
							>
								<Image
									width='23px'
									height='23px'
									borderRadius='50%'
									objectFit='none'
									background='#fff'
									mr='10px'
								/>
								<Box as='span' fontWeight='bold' alignSelf='center' mr='5px'>DAI</Box>
								<TriangleDownIcon
									alignSelf='center'
									height='0.7rem'
									marginTop='1px'
								/>
							</Box>
						</Flex>

						<Button
							width='100%'
							m='2rem auto'
							size='lg'
							variant='solidRounded'
						>
							<Box
								fontWeight='1000'
							>
							Add
							</Box>
						</Button>
					</Flex>
				</Flex>
			</Flex>
		</Box>
	)
}

export default PoolDetail
