import React from 'react'
import { useQuery } from 'react-query'
import { BigNumber, utils } from 'ethers'
import { Button, Box, Image, Fade } from '@chakra-ui/react'
import defaults from '../common/defaults'
import { useWallet } from 'use-wallet'
import { useXvaderPrice } from '../hooks/useXvaderPrice'
import { getERC20BalanceOf } from '../common/ethereum'
import { prettifyNumber } from '../common/utils'

export const BalanceIndicator = () => {

	const wallet = useWallet()
	const xvdrExchangeRate = useXvaderPrice(0)

	const vaderBalance = useQuery(`${defaults.vader.address}_erc20Balanceof_${wallet?.account}`,
		async () => {
			if (wallet.account) {
				return await getERC20BalanceOf(
					defaults.vader.address,
					wallet.account,
					defaults.network.provider,
				)
			}
		}, {
			staleTime: defaults.api.staleTime,
		},
	)

	const xvaderBalance = useQuery(`${defaults.xvader.address}_erc20Balanceof_${wallet?.account}`,
		async () => {
			if (wallet.account) {
				return await getERC20BalanceOf(
					defaults.xvader.address,
					wallet.account,
					defaults.network.provider,
				)
			}
		}, {
			staleTime: defaults.api.staleTime,
		},
	)

	const totalBalance = () => {
		if (xvdrExchangeRate?.[0]?.global.value && xvaderBalance.data && vaderBalance.data) {
			return utils.formatEther(
				BigNumber.from(xvdrExchangeRate?.[0]?.global?.value)
					.mul(xvaderBalance?.data)
					.div(utils.parseUnits('1', 18))
					.add(vaderBalance?.data))
		}
	}

	return (
		<>
			{Number(totalBalance()) > 0 &&
				<>
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
										{prettifyNumber(totalBalance())}
									</Box>
								</Box>
							</Box>
						</Button>
					</Fade>
				</>
			}
		</>
	)
}
