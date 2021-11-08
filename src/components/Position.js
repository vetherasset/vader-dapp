import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ethers } from 'ethers'
import { Flex, Image } from '@chakra-ui/react'
import { getTokenByAddress, prettifyCurrency } from '../common/utils'
import defaults from '../common/defaults'

export const Position = (props) => {

	Position.propTypes = {
		foreignTokenAddress: PropTypes.string.isRequired,
		position: PropTypes.object.isRequired,
	}

	const [token, setToken] = useState({})

	useEffect(() => {
		getTokenByAddress(props.foreignTokenAddress)
			.then((t) => {
				setToken(t)
			})
		return () => setToken({})
	}, [props.foreignTokenAddress])

	return (
		<>
			<Flex
				width='100%'
				alignItems='center'
				justifyContent='space-between'
				p='0 24px'
				minH='60px'
				cursor='pointer'
				background='rgba(244, 155, 202, 0.08) none repeat scroll 0% 0%'
				mb='16px'
				borderRadius='16px'
				_hover={{
					background: 'rgba(244, 155, 202, 0.13) none repeat scroll 0% 0%',
				}}
			>
				<Flex
					fontWeight='bolder'>
					<Image
						width='23px'
						height='23px'
						borderRadius='50%'
						objectFit='none'
						background='#fff'
						mr='10px'
						src={token.logoURI}
					/>
					<Image
						width='23px'
						height='23px'
						borderRadius='50%'
						objectFit='none'
						background='#fff'
						mr='10px'
						src={defaults.nativeAsset.logoURI}
					/>
					{token.symbol}/{defaults.nativeAsset.symbol}
				</Flex>
				<Flex>
					{prettifyCurrency(ethers.utils.formatUnits(props.position.originalNative, defaults.nativeAsset.decimals) * 3333 * ethers.utils.formatUnits(props.position.originalForeign, token.decimals), 0, 4, defaults.nativeAsset.symbol)}
				</Flex>
			</Flex>
		</>
	)
}