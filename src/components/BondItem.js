/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { ethers } from 'ethers'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Flex, Image, Tag } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { prettifyCurrency } from '../common/utils'
import { bondInfo, bondPrice, bondPayoutToken, resolveERC20 } from '../common/ethereum'
import defaults from '../common/defaults'
import { useBondPrice } from '../hooks/useBondPrice'

export const BondItem = (props) => {

	BondItem.propTypes = {
		address: PropTypes.string.isRequired,
		token0: PropTypes.object.isRequired,
		token1: PropTypes.object,
		setLoading: PropTypes.func,
	}

	const wallet = useWallet()
	const [accountBondInfo, setAccountBondInfo] = useState([])
	const [bondItemPayoutToken, setBondItemPayoutToken] = useState(undefined)
	const [bondItemToken0, setBondItemToken0] = useState(undefined)
	const [bondItemToken1, setBondItemToken1] = useState(undefined)
	const [bondItemPriceGQL] = useBondPrice()

	useEffect(() => {
		if (props.address && wallet.account) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			bondInfo(wallet.account, props.address, provider)
				.then((i) => setAccountBondInfo(i))
				.catch(err => console.log(err))
		}
	}, [props.address, wallet.account])

	useEffect(() => {
		if (props.address) {
			bondPayoutToken(props.address)
				.then((a) => {
					resolveERC20(a)
						.then((t) => setBondItemPayoutToken(t))
						.catch(err => console.log(err))
				})
				.catch(err => console.log(err))
		}
	}, [props.address])

	useEffect(() => {
		if (props.token0) {
			resolveERC20(defaults.address.vader, props.token0.logoURI)
			// resolveERC20(props.token0.address, props.token0.logoURI)
				.then((t) => setBondItemToken0(t))
				.catch(err => console.log(err))
		}
	}, [props.token0])

	useEffect(() => {
		if (props.token1
			&& props.token1.isEther !== true) {
			resolveERC20(props.token1.address, props.token1.logoURI)
				.then((t) => setBondItemToken1(t))
				.catch(err => console.log(err))
		}
		else {
			setBondItemToken1(defaults.ether)
		}
	}, [props.token1])

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
					animation={ accountBondInfo?.payout?.gt(0) ? '2.3s ease-in-out infinite bgAnimation' : '' }
					transition='all 0.3s ease 0s'
					background='rgba(244, 155, 202, 0.08) none repeat scroll 0% 0%'
					mb='16px'
					borderRadius='16px'
					border={ accountBondInfo?.payout?.gt(0) ? '1px solid #ffffff10' : '1px solid #ffffff08' }
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
							src={bondItemToken0?.logoURI}
						/>
						<Image
							width='23px'
							height='23px'
							borderRadius='50%'
							mr='10px'
							src={bondItemToken1?.logoURI}
						/>
						{bondItemToken0?.symbol}{bondItemToken1 ? ` / ${bondItemToken1.symbol}` : ''}
						{accountBondInfo?.payout?.gt(0) &&
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
						<Tag colorScheme='blue'>
							{bondItemPriceGQL?.bondPriceChangedEvents?.[0].internalPrice &&
								<>
									{prettifyCurrency(
										ethers.utils.formatUnits(
											bondItemPriceGQL?.bondPriceChangedEvents?.[0].internalPrice,
											18,
										),
										0,
										4,
									)}
								</>
							}
						</Tag>
						<Tag colorScheme='blue'>
							{bondItemPayoutToken?.symbol}
						</Tag>
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