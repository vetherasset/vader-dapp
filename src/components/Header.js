import React from 'react'
import { useLocation } from 'react-router-dom'
import { Flex, useBreakpointValue } from '@chakra-ui/react'
import defaults from '../common/defaults'
import { Link } from 'react-router-dom'
import { Logotype } from './Logotype'
import { WalletConnectionToggle } from './WalletConnectionToggle'
import { BurgerMenu } from './BurgerMenu'

export const Header = (props) => {

	const location = useLocation()
	const pages = [
		{
			name: 'swap',
			text: 'Swap',
			link: '/',
		},
		{
			name: 'liquidity',
			text: 'Liquidity',
			link: '/liquidity',
		},
		{
			name: 'synths',
			text: 'Synths',
			link: '/synths',
		},
		{
			name: 'redeem',
			text: 'Redeem',
			link: '/redeem',
		},
	]

	const current = {
		background: '#835a81',
		borderRadius: '10px',
		fontWeight: '1000',
		color: '#fff',
	}

	return (
		<Flex
			style={{ justifyContent: 'space-between', alignItems: 'center' }}
			minH={defaults.layout.header.minHeight}
			{...props}>
			<Flex w={{ md: '20%', sm: '30%' }}>
				<Logotype margin='0 8px 0' />
			</Flex>
			<Flex w='100%'
				alignItems='center'
				justifyContent='space-around'
				textTransform='capitalize'
				layerStyle='colorful'
				p='0.3rem 0.2rem'
				maxW='400px'
				display={{ base: 'none', md: 'flex' }}
			>
				{pages.map(p =>
					<Link
						key={p.name}
						to={p.link}
						style={ {
							color: 'rgb(213, 213, 213)',
							padding: '0.4rem 0.8rem',
							...(p.link === location.pathname && current),
						}}
					>
						{p.text}
					</Link>)
				}
			</Flex>
			<Flex w='20%' justifyContent='flex-end'>
				<Flex
					display={{ base: 'none', md: 'flex' }}
				>
					<WalletConnectionToggle />
				</Flex>
				{useBreakpointValue({
					base: <BurgerMenu pages={pages}/>,
					md: '',
				})}
			</Flex>
		</Flex>
	)
}
