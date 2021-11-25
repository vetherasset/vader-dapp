import React from 'react'
import PropTypes from 'prop-types'
import { Menu, MenuButton, IconButton, MenuList } from '@chakra-ui/react'
// import { Link } from 'react-router-dom'
import { HamburgerIcon } from '@chakra-ui/icons'
import { WalletConnectionToggle } from './WalletConnectionToggle'

export const BurgerMenu = () => {
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
				{/* {props.pages.map(p => <Link
					key={p.name}
					to={p.link}
				>
					<MenuItem key={p.name} pb='1rem'>
						{p.text}
					</MenuItem>
				</Link>)} */}
				<WalletConnectionToggle w='100%' />
			</MenuList>
		</Menu>
	)
}
