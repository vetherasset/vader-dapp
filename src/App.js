import React, {} from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect, useLocation } from 'react-router-dom'
import { ChakraProvider, Box } from '@chakra-ui/react'
import theme from './themes/vader'
import { UseWalletProvider } from 'use-wallet'
import { Header } from './components/Header'
import Burn from './locations/burn'
import Stake from './locations/stake'
import Earn from './locations/earn'
import Bonds from './locations/bonds'
import Bond from './locations/bond'
import Tokens from './locations/tokens'
import defaults from './common/defaults'
import { Footer } from './components/Footer'
import { Wave } from './assets/svg/effects/Wave'

const App = () => {

	return (
		<Router>
			<ChakraProvider theme={theme}>
				<UseWalletProvider
					chainId={defaults.network.chainId}
					connectors={defaults.network.connectors}
					autoConnect={defaults.network.autoConnect}
				>
					<Header
						width={defaults.layout.header.width}
						p={defaults.layout.header.padding}
						justifyContent='center'
						position='relative'
						zIndex='2'/>
					<Switch>
						<Route path='/' exact render={() =>
							<Stake position='relative' zIndex='1'/>
						}/>
						<Route path='/earn' exact render={() =>
							<Earn position='relative' zIndex='1'/>
						}/>
						<Route path='/bond' exact render={() =>
							<Bonds position='relative' zIndex='1'/>
						}/>
						<Route path='/bond/:address' exact render={() =>
							<Bond position='relative' zIndex='1'/>
						}/>
						<Route path='/acquire' exact render={() =>
							<Burn position='relative' zIndex='1'/>
						}/>
						<Route path='/tokens' exact render={() =>
							<Tokens inverted position='relative' zIndex='1'/>
						}/>
						<Route path='*' render={() =>
							<Redirect to={'/'} />
						} />
					</Switch>
					<Footer
						width='auto'
						height='10vh'
						maxWidth={defaults.layout.container.sm.width}
						m='0 auto'
						opacity='0.8'
						position='relative'
						zIndex='1'
						alignContent='center'
						flexWrap='wrap'
						padding='8.53rem 2rem 6.53rem'
						style={{
							gap: '0 2rem',
						}}
					/>
					<Wave
						width='100%'
						height='777.65665px'
						position='absolute'
						left='50%'
						top='65%'
						transform='translate(-50%, -65%)'
						m='0 auto'
						overflowX='hidden'>
						<Box
							id='radialMask'
							width='100%'
							height='100%'
							transform={maskTransform}
						/>
					</Wave>
      	</UseWalletProvider>
			</ChakraProvider>
		</Router>
	)
}

const maskTransform = () => {
	const location = useLocation()
	if(
		location.pathname.includes('earn') ||
		location.pathname.includes('bond') ||
		location.pathname.includes('pool') ||
		location.pathname === '/'
	) {
		return {
			base: 'scaleX(1.5)',
			md: 'scaleX(1.4)',
			xl: 'scaleX(1.2)',
		}
	}
}

export default App
