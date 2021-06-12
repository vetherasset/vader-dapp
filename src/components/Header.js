import React from 'react'
import { Flex } from '@chakra-ui/react'
import defaults from '../common/defaults'
import { Link } from 'react-router-dom'
import { Logotype } from './Logotype'
import { WalletConnectionToggle } from './WalletConnectionToggle'

export const Header = (props) => {

	return (
		<Flex
			minH={defaults.layout.header.minHeight}
			{...props}>
			<Flex w='33%'>
				<Logotype margin='0 8px 0'/>
			</Flex>
			<Flex w='33%'
				alignItems='center'
				justifyContent='space-around'
				textTransform='uppercase'
			>
				<Link to='/'>Swap</Link>
				<Link to='/'>Liquidity</Link>
				<Link to='/'>Synths</Link>
				<Link to='/redeem'>Redeem</Link>
			</Flex>
			<Flex w='33%'
				justifyContent='flex-end'
				alignItems='center'
			>
				<WalletConnectionToggle/>
			</Flex>
		</Flex>
	)
}
