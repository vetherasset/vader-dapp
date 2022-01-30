import React from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Flex, Image, useBreakpointValue, Link as LinkExt } from '@chakra-ui/react'
import defaults from '../common/defaults'
import { Link } from 'react-router-dom'
import { Logotype } from './Logotype'
import { WalletConnectionToggle } from './WalletConnectionToggle'
import { BalanceIndicator } from '../components/BalanceIndicator'
import { BurgerMenu } from './BurgerMenu'

export const Header = (props) => {

	const location = useLocation()
	const pages = [
		{
			name: 'Stake',
			text: 'Stake',
			link: '/stake',
		},
		{
			name: 'Bond',
			text: 'Bond',
			link: '/bond',
		},
		{
			name: 'Acquire',
			text: 'Acquire',
			link: '/acquire',
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
			<Flex w={{ md: '100%', sm: '30%' }}>
				<Logotype margin='0 8px 0' />
			</Flex>
			<Flex w='auto'
				minW='216px'
				alignItems='center'
				justifyContent='space-around'
				textTransform='capitalize'
				layerStyle='colorful'
				borderRadius='12px'
				p='0.3rem 0.2rem'
				display={{ base: 'none', md: 'flex' }}
			>
				{pages.map(p =>
					<Link
						key={p.name}
						to={p.link}
						style={ {
							color: 'rgb(213, 213, 213)',
							padding: '0.4rem 0.8rem',
							...(location.pathname === '/' && p.name === 'Stake' && current),
							...(p.link === location.pathname && current),
							...(p.link === '/bond' && location.pathname.includes('bond') && current),
							...(p.link === '/pool' && location.pathname.includes('pool') && current),
						}}
					>
						{p.text}
					</Link>)
				}
			</Flex>
			<Flex
 				w={{ md: '100%', sm: '70%' }}
 				justifyContent='flex-end'
				gridGap={{ base: '7.3px', sm: '17.3px' }}
			>
				{useBreakpointValue({
					base:	<>
						<BalanceIndicator/>
					</>,
					md: '',
					lg: <>
						<LinkExt
							isExternal href='https://curve.fi/factory/82'>
							<Button
								overflow='hidden'
								height='38px'
								variant='linkAccent'
								rightIcon={<Image src='/svg/curvefi.svg' width='32px'/>}
							>
								USDV3CRV-f
							</Button>
						</LinkExt>
						<BalanceIndicator/>
					</>,
				})}
				{useBreakpointValue({
					base: <BurgerMenu pages={pages}/>,
					md: <WalletConnectionToggle />,
				})}
			</Flex>
		</Flex>
	)
}
