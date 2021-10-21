import React, {} from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { ChakraProvider, Box } from '@chakra-ui/react'
import theme from './themes/vader'
import { UseWalletProvider } from 'use-wallet'
import { Header } from './components/Header'
import Swap from './locations/swap'
import Burn from './locations/burn'
import Liquidity from './locations/liquidity'
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
						<Route path='/liquidity' exact render={() =>
							<Liquidity position='relative' zIndex='1'/>
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
						m='0 auto'>
						<Box
							id='radialMask'
							width='100%'
							height='100%'
						/>
					</Wave>
      	</UseWalletProvider>
			</ChakraProvider>
		</Router>
	)
}

export default App