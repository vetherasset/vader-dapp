import React, {} from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './themes/vader'
import { UseWalletProvider } from 'use-wallet'
import { Header } from './components/Header'
import Swap from './locations/swap'
import Redeem from './locations/redeem'
import Syths from './locations/syths'
import Pool from './locations/pool'
import defaults from './common/defaults'

const App = () => {

	return (
		<Router>
			<ChakraProvider theme={theme}>
				<UseWalletProvider
					chainId={defaults.network.chainId}
					connectors={defaults.network.connectors}
				>
					<Header width={defaults.layout.header.width}
						      p={defaults.layout.header.padding}
							    justifyContent='center'/>
					<Switch>
						<Route path='/' exact render={() =>
							<Swap />
						}/>
						<Route path='/redeem' exact render={() =>
							<Redeem />
						}/>
						<Route path='/syths' exact render={() =>
							<Syths />
						}/>
						<Route path='/pool' exact render={() =>
							<Pool />
						}/>
						<Route path='*' render={() =>
							<Redirect to={'/'} />
						} />
					</Switch>
      	</UseWalletProvider>
			</ChakraProvider>
		</Router>
	)
}

export default App