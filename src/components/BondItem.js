import React from 'react'
import { useWallet } from 'use-wallet'
import { ethers } from 'ethers'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Flex, Image, Tag } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { prettifyCurrency } from '../common/utils'
import { useBondPrice } from '../hooks/useBondPrice'
import { useBondInfo } from '../hooks/useBondInfo'
import { useUniswapV2Price } from '../hooks/useUniswapV2Price'
import defaults from '../common/defaults'

export const BondItem = (props) => {

	BondItem.propTypes = {
		address: PropTypes.string.isRequired,
		token0: PropTypes.object.isRequired,
		token1: PropTypes.object,
		payout: PropTypes.object.isRequired,
	}

	const wallet = useWallet()
	const [bondInfo] = useBondInfo(String(wallet.account).toLocaleLowerCase())
	const [bondPrice] = useBondPrice(props.address)
	const [usdcEth] = useUniswapV2Price(defaults.address.uniswapV2.usdcEthPair)
	const [principalEth] = useUniswapV2Price(defaults.address.uniswapV2.vaderEthPair, true)

	return (
		<>
			<Link to={`/bond/${props.address}`}>
				<Flex
					width='100%'
					alignItems='center'
					justifyContent='space-between'
					p='0 24px'
					minH='60px'
					cursor='pointer'
					animation={ bondInfo?.bonds?.[0]?.payout && ethers.BigNumber.from(bondInfo?.bonds?.[0]?.payout).gt(0) ? '2.3s ease-in-out infinite bgAnimation' : '' }
					transition='all 0.3s ease 0s'
					background='rgba(244, 155, 202, 0.08) none repeat scroll 0% 0%'
					mb='16px'
					borderRadius='16px'
					border={ bondInfo?.bonds?.[0]?.payout && ethers.BigNumber.from(bondInfo?.bonds?.[0]?.payout).gt(0) ? '1px solid #ffffff10' : '1px solid #ffffff08' }
					_hover={{
						cursor: 'pointer',
						background: 'rgba(244, 155, 202, 0.2) none repeat scroll 0% 0%',
						border: '1px solid #ffffff10',
					}}
				>
					<Flex
						fontWeight='bolder'>
						<Image
							width='23px'
							height='23px'
							borderRadius='50%'
							mr='7px'
							src={props.token0?.logoURI}
						/>
						<Image
							width='23px'
							height='23px'
							borderRadius='50%'
							mr='10px'
							src={props.token1?.logoURI}
						/>
						{props.token0?.symbol}{props.token1 ? ` / ${props.token1.symbol}` : ''}
						{bondInfo?.bonds?.[0]?.payout && ethers.BigNumber.from(bondInfo?.bonds?.[0]?.payout).gt(0) &&
							<Tag
								ml='10px'
								colorScheme='green'>
								<CheckCircleIcon
									mr='5px'
								/> BOUGHT
							</Tag>
						}
					</Flex>
					<Flex
						flexDir='row'
						alignContent='flex-end'
						justifyContent='flex-end'
						gridGap='0.7rem'
					>
						{bondPrice && usdcEth?.pairs?.[0]?.token0Price && principalEth?.principalPrice &&
								<>
									<Tag colorScheme='blue'>
										{prettifyCurrency(
											Number(ethers.utils.formatUnits(bondPrice?.global?.value, 18)) *
											(Number(usdcEth?.pairs?.[0]?.token0Price) * Number(principalEth?.principalPrice)),
											0, 5)}
									</Tag>
								</>
						}
						<Tag colorScheme='blue'>
							100%
						</Tag>
						<Tag colorScheme='blue'>
							{prettifyCurrency(999999999, 0, 4)}
						</Tag>
					</Flex>
				</Flex>
			</Link>
		</>
	)
}