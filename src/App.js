import React, {} from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect, useLocation } from 'react-router-dom'
import { ChakraProvider, Box } from '@chakra-ui/react'
import theme from './themes/vader'
import { UseWalletProvider } from 'use-wallet'
import { Header } from './components/Header'
import Swap from './locations/swap'
import Pool from './locations/pool'
import Deposit from './locations/deposit'
import Burn from './locations/burn'
import defaults from './common/defaults'
import { Wave } from './assets/svg/effects/Wave'

const App = () => {

	return (
		<Router>
			<ChakraProvider theme={theme}>
				<UseWalletProvider
					chainId={defaults.network.chainId}
					connectors={defaults.network.connectors}
				>
					<Header
						width={defaults.layout.header.width}
						p={defaults.layout.header.padding}
						justifyContent='center'
						position='relative'
						zIndex='2'/>
					<Switch>
						<Route path='/' exact render={() =>
							<Swap position='relative' zIndex='1'/>
						}/>
						<Route path='/burn' exact render={() =>
							<Burn position='relative' zIndex='1'/>
						}/>
						<Route path='/pool' exact render={() =>
							<Pool position='relative' zIndex='1'/>
						}/>
						<Route path='/pool/deposit' exact render={() =>
							<Deposit position='relative' zIndex='1'/>
						}/>
						<Route path='/pool/deposit/:tokenAddress' exact render={() =>
							<Deposit position='relative' zIndex='1'/>
						}/>
						<Route path='/pool/deposit/:tokenAddressA/:tokenAddressB' exact render={() =>
							<Deposit position='relative' zIndex='1'/>
						}/>
						<Route path='*' render={() =>
							<Redirect to={'/'} />
						} />
					</Switch>
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
	if(location.pathname.includes('pool')) {
		return {
			base: 'scaleX(1.5)',
			md: 'scaleX(1.4)',
			xl: 'scaleX(1.2)',
		}
	}
}

export default App