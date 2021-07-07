import React, { useState } from 'react'
import { Flex, Menu, MenuItem, IconButton, MenuButton, MenuList } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import defaults from '../common/defaults'
import { Link } from 'react-router-dom'
import { Logotype } from './Logotype'
import { WalletConnectionToggle } from './WalletConnectionToggle'
import '../scss/header.scss'
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

	const [currentPath, setCurrentPath] = useState('/')

	return (
		<Flex
			style={{ justifyContent: 'space-between', alignItems: 'center' }}
			minH={defaults.layout.header.minHeight}
			{...props}>
			<Flex w={{ md: '20%', sm: '30%' }}>
				<Logotype margin='0 8px 0' />
			</Flex>
			<Flex w='60%'
				alignItems='center'
				justifyContent='space-around'
				textTransform='uppercase'
				layerStyle='colorful'
				p='.6rem'
				maxW='500px'
				display={{ base: 'none', md: 'flex' }}
			>
				{pages.map(p =>
					<Link
						onClick={() => {
							setCurrentPath(p.link)
						}}
						className={p.link === currentPath ? 'active' : ''}
						key={p.name} to={p.link}>{p.text}</Link>)}
			</Flex>
			<Flex w='20%' 	justifyContent='flex-end'>
				<Flex
					display={{ base: 'none', md: 'flex' }}
				>
					<WalletConnectionToggle />
				</Flex>
				<Menu>
					<MenuButton display={{ base: 'flex', md: 'none' }}
						as={IconButton}
						aria-label='Options'
						icon={<HamburgerIcon />}
						variant='outline'
					/>
					<MenuList p='1rem'>
						{pages.map(p => <MenuItem key={p.name} pb='1rem'>
							<Link className={p.link === currentPath ? 'active' : ''}
								onClick={() => {
									setCurrentPath(p.link)
								}} to={p.link}>{p.text}</Link>
						</MenuItem>)}
						<WalletConnectionToggle w='100%' />
					</MenuList>
				</Menu>
			</Flex>
		</Flex>
	)
}
