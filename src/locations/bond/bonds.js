/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Button, Flex, Text, Image } from '@chakra-ui/react'
import defaults from '../../common/defaults'
import { getERC20BalanceOf, bond } from '../../common/ethereum'
import {
	prettifyNumber,
	getPercentage,
	getTokenPrice,
} from '../../common/utils'
import { ethers } from 'ethers'
const Bonds = props => {
	const [bonds] = useState(defaults.bondable)
	const [bondContract0] = useState(bonds[0].address)
	const [treasuryContract0] = useState(bonds[0].treasury)
	const [payoutToken0] = useState(bonds[0].payoutToken)
	const [principalToken0] = useState(bonds[0].principalToken)
	const [treasuryBalance, setTreasuryBalance] = useState(0)
	const [payoutTokenPrice, setPayoutTokenPrice] = useState(0)
	const [bondPrice0, setBondPrice0] = useState(0)
	const [roi0, setRoi0] = useState(0)
	const [purchasedBalance0, setPurchasedBalance0] = useState(0)

	useEffect(() => {
		Promise.all([
			getTokenPrice(payoutToken0.coingeckoId),
			getTokenPrice(principalToken0.coingeckoId),
			getERC20BalanceOf(
				principalToken0.address,
				treasuryContract0,
				defaults.network.provider,
			),
			bond(bondContract0, defaults.network.provider).price(),
		]).then(
			([payoutTokenPriceUsd, principalTokenPriceUsd, balance, bondPrice]) => {
				setPayoutTokenPrice(payoutTokenPriceUsd)
				const _purchasedBalance0 =
					ethers.utils.formatUnits(
						balance.toString(),
						principalToken0.decimals,
					) * principalTokenPriceUsd
				setPurchasedBalance0(_purchasedBalance0)
				// treasury balance equals to purchased balance because there is only one bond atm
				setTreasuryBalance(_purchasedBalance0)
				const bondPriceUsd =
					bondPrice.div(100).toNumber() * principalTokenPriceUsd
				setBondPrice0(bondPriceUsd)
				setRoi0((payoutTokenPriceUsd - bondPriceUsd) / bondPriceUsd)
			},
		)
	}, [])

	return (
		<Box
			height={`calc(100vh - ${defaults.layout.header.minHeight})`}
			maxWidth={defaults.layout.container.md.width}
			m="0 auto"
			p={{ base: '5rem 1.2rem 0', md: '5rem 0 0' }}
			{...props}
		>
			<Flex
				m="0 auto"
				p="1px"
				flexDir="column"
				height="auto"
				layerStyle="colorful"
				backgroundImage="linear-gradient(90deg,rgb(100, 71, 101) 0%,rgb(33, 74, 112) 100%)"
			>
				<Flex
					width="100%"
					layerStyle="colorful"
					background="#000000c4;"
					p="1.5rem"
					flexDir="column"
					justifyContent="flex-start"
					position="relative"
				>
					<Flex alignItems="center" justifyContent="space-around">
						<Box textAlign="center">
							<Text fontSize="1.2rem" fontWeight="medium">
								Treasury Balance
							</Text>
							<Text fontSize="1.25rem" fontWeight="bold">
								${prettifyNumber(treasuryBalance, 0)}
							</Text>
						</Box>
						<Box textAlign="center">
							<Text fontSize="1.2rem" fontWeight="medium">
								{payoutToken0.symbol} Price
							</Text>
							<Text fontSize="1.25rem" fontWeight="bold">
								${prettifyNumber(payoutTokenPrice, 2, 5)}
							</Text>
						</Box>
					</Flex>
					<Flex flexDir="row" alignItems="center" mb="0.75rem" mt="3rem">
						<Text flex="2">Bond</Text>
						<Text flex="2">Price</Text>
						<Text flex="2">ROI</Text>
						<Text flex="2">Purchased</Text>
						<Box flex="1"></Box>
					</Flex>
					{bonds.map(item => (
						<Flex flexDir="row" align="center" mt="0.5rem" key={item.name}>
							<Flex flex="2" align="center">
								<Image src={item.principalToken.logoURI} w="24px" h="24px" />
								<Text ml="0.5rem">{item.principalToken.symbol}</Text>
							</Flex>
							<Text flex="2">${prettifyNumber(bondPrice0, 2, 5)}</Text>
							<Text flex="2">{getPercentage(roi0, 2)}</Text>
							<Text flex="2">${prettifyNumber(purchasedBalance0, 0)}</Text>
							<Flex flex="1" justifyContent="flex-end">
								<Link to={`/bonds/${item.name}`}>
									<Button ml="0.75rem" variant="solidRadial" size="sm">
										Bond
									</Button>
								</Link>
							</Flex>
						</Flex>
					))}
				</Flex>
			</Flex>
		</Box>
	)
}

export default Bonds
