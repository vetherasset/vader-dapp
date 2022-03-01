import React from 'react'
import { useWallet } from 'use-wallet'
import { ethers } from 'ethers'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Flex, Image, Tag } from '@chakra-ui/react'
import { CheckCircleIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { prettifyCurrency, getPercentage, calculateDifference } from '../common/utils'
import { useBondInfo } from '../hooks/useBondInfo'
import { useUniswapV2Price } from '../hooks/useUniswapV2Price'
import defaults from '../common/defaults'
import { useBondPrice } from '../hooks/useBondPrice'
import { usePreCommit } from '../hooks/usePreCommit'

export const BondItem = (props) => {

	BondItem.propTypes = {
		bond: PropTypes.object.isRequired,
	}

	const wallet = useWallet()
	const { data: bondInfo } = useBondInfo(props.bond?.address, wallet.account, true)
	const [vaderEth] = useUniswapV2Price(props.bond?.principal?.address)
	const [usdcEth] = useUniswapV2Price(defaults.address.uniswapV2.usdcEthPair)
	const [principalEth] = useUniswapV2Price(props.bond?.principal?.address, true)
	const { data: price } = useBondPrice(props.bond?.address)

	const bondInitPrice = (Number(ethers.utils.formatUnits(price ? price : '0', 18)) *
	(Number(usdcEth?.pairs?.[0]?.token0Price) * Number(principalEth?.principalPrice)))
	const marketPrice = (Number(usdcEth?.pairs?.[0]?.token0Price) * Number(vaderEth?.pairs?.[0]?.token1Price))
	const roi = calculateDifference(marketPrice, bondInitPrice)
	const roiPercentage = isFinite(roi) ? getPercentage(roi)?.replace('-0', '0') : ''
	const preCommit = usePreCommit(props?.bond?.precommit)

	return (
		<>
			<Link to={`/bond/${props.bond.address}`}>
				<Flex
					width='100%'
					alignItems='center'
					justifyContent='space-between'
					p={{ base: '12px 11px', md: '0 24px' }}
					minH='60px'
					cursor='pointer'
					animation={ bondInfo?.[1] && bondInfo?.[1]?.gt(0) ? '2.3s ease-in-out infinite bgAnimation' : '' }
					transition='all 0.3s ease 0s'
					background='rgba(244, 155, 202, 0.08) none repeat scroll 0% 0%'
					mb='16px'
					borderRadius='16px'
					border={ bondInfo?.[1] && bondInfo?.[1]?.gt(0) ? '1px solid #ffffff10' : '1px solid #ffffff08' }
					_hover={{
						cursor: 'pointer',
						background: 'rgba(244, 155, 202, 0.2) none repeat scroll 0% 0%',
						border: '1px solid #ffffff10',
					}}
				>
					<Flex
						alignItems={{ base: 'center' }}
						width={{ base: '54%', md: '' }}
						flexWrap={bondInfo?.[1] && bondInfo?.[1]?.gt(0) ? 'wrap' : '' }
						fontSize={{ base: '0.75rem', md: '1rem' }}
						fontWeight='bolder'>
						<Image
							width='23px'
							height='23px'
							borderRadius='50%'
							mr={{ base: '3px', md: '7px' }}
							src={props.bond.token0?.logoURI}
							alt={`${props.bond.token0?.name} token`}
						/>
						{props.bond?.token1?.logoURI &&
						<Image
							width='23px'
							height='23px'
							borderRadius='50%'
							mr={{ base: '2px', md: '10px' }}
							src={props.bond.token1?.logoURI}
							alt={`${props.bond.token1?.name} token`}
						/>
						}
						{props.bond.token0?.symbol}{props.bond.token1 ? ` / ${props.bond.token1.symbol}` : `${String.fromCharCode(8194)}${props.bond.name}`}
						{bondInfo?.[1] && bondInfo?.[1]?.gt(0) &&
							<Tag
								fontSize={{ base: '0.67rem', md: '0.83rem' }}
								mt={{ base: '3px', md: '' }}
								ml='10px'
								borderRadius='11px'
								variant='subtle'
								colorScheme='cyan'>
								<CheckCircleIcon
									mr='5px'
								/> Purchased
							</Tag>
						}
						{preCommit.open.data &&
							<Tag
								fontSize={{ base: '0.67rem', md: '0.83rem' }}
								mt={{ base: '3px', md: '' }}
								ml='10px'
								borderRadius='11px'
								variant='subtle'
								colorScheme='purple'>
								<ArrowForwardIcon
									mr='5px'
								/> Pre-commit
							</Tag>
						}
					</Flex>
					<Flex
						flexDir='row'
						alignContent='flex-end'
						justifyContent='flex-end'
						gridGap='0.7rem'
					>
						{price && usdcEth?.pairs?.[0]?.token0Price && principalEth?.principalPrice &&
							<>
								<Tag
									fontSize={{ base: '0.67rem', md: '0.83rem' }}
									colorScheme='gray'>
									{prettifyCurrency(
										props.bond.principal ? (Number(ethers.utils.formatUnits(price, 18)) *
										(Number(usdcEth?.pairs?.[0]?.token0Price) *
										Number(principalEth?.principalPrice))) : (Number(ethers.utils.formatUnits(price, 18)) *
										(Number(usdcEth?.pairs?.[0]?.token0Price))),
										0, 5)}
								</Tag>
							</>
						}
						{((preCommit?.open?.data &&
									props?.bond?.discount) ||
							(!preCommit?.open?.data &&
							roiPercentage > 0)) &&
							<Tag
								fontSize={{ base: '0.67rem', md: '0.83rem' }}
								colorScheme='gray'>
								{preCommit?.open?.data &&
									props?.bond?.discount &&
									<>
										{getPercentage(props?.bond?.discount)}
									</>
								}
								{!preCommit?.open?.data &&
									roiPercentage &&
									<>
										{roiPercentage}
									</>
								}
							</Tag>
						}
					</Flex>
				</Flex>
			</Link>
		</>
	)
}