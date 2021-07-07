import React from 'react'
import { Box, Flex, Menu, MenuItem, IconButton, MenuButton, MenuList } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import defaults from '../common/defaults'
import { Link } from 'react-router-dom'
import { Logotype } from './Logotype'
import { WalletConnectionToggle } from './WalletConnectionToggle'

export const Header = (props) => {
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

	return (
		<Flex
			style={{ justifyContent: 'space-between', alignItems: 'center' }}
			minH={defaults.layout.header.minHeight}
			{...props}>
			<Flex w={{ md: '33%', sm: '50%' }}>
				<Logotype margin='0 8px 0' />
			</Flex>
			<Flex w='67%' display={{ base: 'none', md: 'flex' }}>
				<Flex w='50%'
					alignItems='center'
					justifyContent='space-around'
					textTransform='uppercase'
				>
					{pages.map(p => <Link key={p.name} to={p.link}>{p.text}</Link>)}
				</Flex>
				<Flex w='50%'
					justifyContent='flex-end'
					alignItems='center'
				>
					<WalletConnectionToggle />
				</Flex>
			</Flex>

			<Menu>
				<MenuButton display={{ base: 'flex', md: 'none' }}
					as={IconButton}
					aria-label='Options'
					icon={<HamburgerIcon />}
					variant='outline'
				/>
				<MenuList p='1rem'>
					{pages.map(p => <MenuItem key={p.name} pb="1rem"><Link to={p.link}>{p.text}</Link></MenuItem>)}
					<WalletConnectionToggle w='100%'/>
				</MenuList>
			</Menu>
		</Flex>
	)
}
