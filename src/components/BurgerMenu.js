import React from 'react'
import PropTypes from 'prop-types'
import { Link, Menu, MenuButton, IconButton, MenuItem, MenuList } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { WalletConnectionToggle } from './WalletConnectionToggle'

export const BurgerMenu = (props) => {
	BurgerMenu.propTypes = {
		pages: PropTypes.array.isRequired,
	}
	return (
		<Menu>
			<MenuButton
				as={IconButton}
				aria-label='Options'
				icon={<HamburgerIcon />}
				variant='solid'
			/>
			<MenuList>
				{props.pages.map(p => <MenuItem key={p.name} pb='1rem'>
					<Link to={p.link}>{p.text}</Link>
				</MenuItem>)}
				<WalletConnectionToggle w='100%' />
			</MenuList>
		</Menu>
	)
}
