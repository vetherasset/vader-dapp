import React from 'react'
import PropTypes from 'prop-types'
import { BigNumber, utils } from 'ethers'
import { Button, Box, Image, Fade, Popover, PopoverTrigger,
	Portal, PopoverContent,
	PopoverBody, Flex, Container, useBreakpointValue } from '@chakra-ui/react'
import defaults from '../common/defaults'
import { useXvaderPrice } from '../hooks/useXvaderPrice'
import { prettifyNumber } from '../common/utils'
import { useERC20Balance } from '../hooks/useERC20Balance'

const Item = (props) => {

	Item.propTypes = {
		name: PropTypes.string.isRequired,
		token: PropTypes.object.isRequired,
		value: PropTypes.any.isRequired,
	}

	return (
		<Box>
			<Box>
				{props.name}
			</Box>
			<Flex>
				<Container p='0'>
					<Box>
						<Flex
							justifyContent='flex-start'
							fontWeight='bolder'>
							<Image
								width='24px'
								height='24px'
								mr='5px'
								src={props.token.logoURI}
								alt={`${props.token.name} token`}
							/>
							{props.token.symbol}
						</Flex>
					</Box>
				</Container>
				<Container p='0'>
					<Box
						fontSize={{ base: '1rem', md: '1.2rem' }}
						fontWeight='bold'
						textAlign='right'
					>
						{props.value}
					</Box>
				</Container>
			</Flex>
		</Box>
	)
}

export const BalanceIndicator = () => {

	const xvdrExchangeRate = useXvaderPrice()
	const vaderBalance = useERC20Balance(defaults.vader.address)
	const xvaderBalance = useERC20Balance(defaults.xvader.address)

	const totalBalance = (total = true) => {
		if (xvdrExchangeRate?.[0]?.global.value &&
			xvaderBalance.data &&
			vaderBalance.data) {
			return utils.formatEther(
				BigNumber.from(xvdrExchangeRate?.[0]?.global?.value)
					.mul(xvaderBalance?.data)
					.div(utils.parseUnits('1', 18))
					.add(total ? vaderBalance?.data : 0))
		}
	}

	const placement = useBreakpointValue({ base: 'bottom-end', md: 'auto' })

	return (
		<>
			{Number(totalBalance()) > 0 &&
				<>
					<Popover
						closeOnEsc={true}
						closeOnBlur={true}
						matchWidth={true}
						placement={placement}
					>
						<PopoverTrigger>
							<Fade
								unmountOnExit={true}
								in={Number(totalBalance()) > 0}
							>
								<Button
									size='md'
									fontSize={{ base: '0.65rem', sm: 'sm' }}
									variant='outlineAlter'
									display='flex'
									flexDirection='row'
									alignItems='center'
									minW='84px'
									transform={{
										base: 'scale(0.86)',
										sm: 'scale(1)',
									}}
								>
									<Box
										display='inline-flex'
										alignItems='center'
										justifyContent='center'
										borderRadius='12px'
										background='#000'
										p='7px 11px'
									>
										<Box d='flex' alignItems='center'>
											<Image
												width='24px'
												height='24px'
												mr='5px'
												src={defaults.vader.logoURI}
												alt={`${defaults.vader.name} token`}
											/>
											<Box
												as='h3'
												m='0'
												fontSize='1.02rem'
												fontWeight='bold'
												textTransform='capitalize'>
												{prettifyNumber(totalBalance(true), 0, 2)}
											</Box>
										</Box>
									</Box>
								</Button>
							</Fade>
						</PopoverTrigger>
						<Portal>
							<PopoverContent
								maxW='304px'
							>
								<PopoverBody
									display='flex'
									flexDir='column'
									gridGap='0.9rem'
									padding='1.6rem 1.6rem'
								>
									{Number(totalBalance(false)) > 0 &&
										<Item
											name={'Staking'}
											token={defaults.vader}
											value={prettifyNumber(totalBalance(false), 0, 2)}
										/>
									}

									{xvaderBalance.data.gt(0) &&
										<Item
											name={'Balance'}
											token={defaults.xvader}
											value={prettifyNumber(utils.formatEther(xvaderBalance.data), 0, 2)}
										/>
									}

									{vaderBalance.data.gt(0) &&
										<Item
											name={'Balance'}
											token={defaults.vader}
											value={prettifyNumber(utils.formatEther(vaderBalance.data), 0, 2)}
										/>
									}
								</PopoverBody>
							</PopoverContent>
						</Portal>
					</Popover>
				</>
			}
		</>
	)
}
