import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { ChakraProvider, Box } from '@chakra-ui/react'
import theme from './themes/vader'
import { UseWalletProvider } from 'use-wallet'
import defaults from './common/defaults'
import { Header } from './components/Header'

import Index from './locations/index'

const App = () => {
	return (
		<Router>
			<ChakraProvider theme={vader}>
				<UseWalletProvider
					chainId={defaults.network.chainId}
					connectors={defaults.network.connectors}>
					<Header width='100%'
						      p='1.2rem 1rem'
							    justifyContent='center'/>
					<Box h='calc(100vh-2.4rem)'
						  justifyContent='center'
						  mx={{ base: '0.5rem', sm: '1rem', md: '2.5rem', lg: '13rem' }}
						  p={3}>
						<Switch>
							<Route path='/' exact render={() =>
								<Index />
							}/>
							<Route path='*' render={() =>
								<Redirect to={'/'} />
							} />
						</Switch>
					</Box>

      	</UseWalletProvider>
			</ChakraProvider>
		</Router>
	)
}

export default App