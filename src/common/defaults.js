import { ApolloClient, InMemoryCache } from '@apollo/client'
import { QueryClient } from 'react-query'
import { ethers } from 'ethers'
import tokenListSources from '../tokenListSources'
import vaderBonds from '../artifacts/js/vaderBonds'
import vaderTokens from '../artifacts/json/vaderTokens'
import snapshot from '../artifacts/json/vetherSnapshot'

const defaults = {
	network: {
		chainId: Number(process.env.REACT_APP_CHAIN_ID),
		connectors: {},
		provider: null,
	},
}

const isEthMainnet = defaults.network.chainId === 1
const isEthTestnet = defaults.network.chainId === 42

defaults.network.provider = new ethers.providers.FallbackProvider(
	[
		{
			provider: new ethers.providers.AlchemyProvider(
				defaults.network.chainId,
				process.env.REACT_APP_ALCHEMY_KEY,
			),
			weight: 1,
			priority: 1,
			stallTimeout: 2000,
		},
	],
)

defaults.network.connectors = {
	metamask: {
		meta: {
			key: 'injected',
			name: 'MetaMask',
			logo: 'https://raw.githubusercontent.com/vetherasset/' +
			'vader-dapp/main/src/assets/svg/icons/' +
			'metamask.svg',
		},
	},
	walletlink: {
		// WalletLink supports only ChainID 1
		chainId: defaults.network.chainId,
		url: (
			isEthMainnet ?
				`https://eth-mainnet.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY}` :
				undefined
		),
		appName: 'Vader Protocol',
		appLogoUrl: 'https://raw.githubusercontent.com/vetherasset/' +
			'branding/main/vader/vader-logo-wo-ring.svg',
		meta: {
			key: 'walletlink',
			name: 'Coinbase Wallet',
			logo: 'https://raw.githubusercontent.com/vetherasset/' +
			'vader-dapp/main/src/assets/svg/icons/' +
			'coinbasewallet.svg',
		},
	},
	walletconnect: {
		rpc: {
			[defaults.network.chainId]: (
				isEthMainnet ?
					`https://eth-mainnet.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY}` :
					isEthTestnet ?
						`https://eth-kovan.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY}` :
						undefined
			),
		},
		meta: {
			key: 'walletconnect',
			name: 'WalletConnect',
			logo: 'https://raw.githubusercontent.com/vetherasset/' +
			'vader-dapp/main/src/assets/svg/icons/' +
			'walletconnect.svg',
		},
	},
	other: {
		meta: {
			key: 'injected',
			name: 'Other',
			logo: 'https://raw.githubusercontent.com/vetherasset/' +
			'vader-dapp/main/src/assets/svg/icons/' +
			'otherwallets.svg',
		},
	},
}
defaults.network.autoConnect = true
defaults.network.pollInterval = 100000

defaults.network.tx = {}
defaults.network.tx.confirmations = 1

defaults.network.blockTime = {}
defaults.network.blockTime.hour = 262

defaults.network.erc20 = {}
defaults.network.erc20.maxApproval = '302503999000000000299700000'

defaults.api = {}
defaults.api.staleTime = 100000
defaults.api.client = new QueryClient()

defaults.api.graphql = {}
defaults.api.graphql.uri = {}
defaults.api.graphql.uri.vaderProtocol = (
	isEthMainnet ? 'https://api.thegraph.com/subgraphs/name/satoshi-naoki/vader-protocol-mainnet' :
		isEthTestnet ? 'https://api.thegraph.com/subgraphs/name/satoshi-naoki/vader-protocol' :
			undefined
)
defaults.api.graphql.uri.uniswapV2 = (
	isEthMainnet ? 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2' :
		isEthTestnet ? 'https://thegraph.com/hosted-service/subgraph/sc0vu/uniswap-v2-kovan' :
			undefined
)

defaults.api.graphql.cache = new InMemoryCache()

defaults.api.graphql.client = {}
defaults.api.graphql.client.vaderProtocol = new ApolloClient({
	uri: defaults.api.graphql.uri.vaderProtocol,
	cache: defaults.api.graphql.cache,
})
defaults.api.graphql.client.uniswapV2 = new ApolloClient({
	uri: defaults.api.graphql.uri.uniswapV2,
	cache: defaults.api.graphql.cache,
})

defaults.api.graphql.pollInterval = 100000

defaults.api.etherscanUrl = (
	isEthMainnet ? 'https://etherscan.io/' :
		isEthTestnet ? 'https://kovan.etherscan.io/' :
			undefined
)

defaults.address = {}
defaults.address.vader = (
	isEthMainnet ? '0x2602278EE1882889B946eb11DC0E810075650983' :
		isEthTestnet ? '0xB46dbd07ce34813623FB0643b21DCC8D0268107D' :
			undefined
)
defaults.address.vether = (
	isEthMainnet ? '0x4Ba6dDd7b89ed838FEd25d208D4f644106E34279' :
		isEthTestnet ? '0x4402a7c8829489705852e54da50ebec60c8c86a8' :
			undefined
)
defaults.address.xvader = (
	isEthMainnet ? '0x665ff8fAA06986Bd6f1802fA6C1D2e7d780a7369' :
		isEthTestnet ? '0x0AA1056Ee563C14484fCC530625cA74575C97512' :
			undefined
)
defaults.address.usdv = (
	isEthMainnet ? undefined :
		isEthTestnet ? '0xfd87ba583bd2071713fb5CB12086536a26eec18e' :
			undefined
),
defaults.address.converter = (
	isEthMainnet ? '0x6D4a43Ee4770a2Bab97460d3a3B783641D85d108' :
		isEthTestnet ? '0x8A313Fa0cb3ed92bE4Cae3a4deF7C32c78181E09' :
			undefined
)
defaults.address.linearVesting = (
	isEthMainnet ? '0xb3C600C04AaF603b0f422b73Db244216C2e491f6' :
		isEthTestnet ? '0xDaA4B82D5Bdd315a3191B080E26ff7A88eb8034E' :
			undefined
)

defaults.address.uniswapV2 = {}
defaults.address.uniswapV2.vaderEthPair = '0x452c60e1e3ae0965cd27db1c7b3a525d197ca0aa'
defaults.address.uniswapV2.usdcEthPair = '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc'

defaults.tokenList = {}
defaults.tokenList.default = vaderTokens
defaults.tokenList.sources = tokenListSources

defaults.ether = {
	'name':'ETHER',
	'symbol':'ETH',
	'decimals':18,
	'logoURI':'https://raw.githubusercontent.com/vetherasset/vader-dapp/65a55cc1d1e89e1549b3d119d296ac8d701a37ea/src/assets/png/eth-diamond-purple-purple.png',
	'isEther': true,
}

defaults.vader = {
	'chainId':defaults.network.chainId,
	'address':defaults.address.vader,
	'name':'VADER',
	'symbol':'VADER',
	'decimals':18,
	'logoURI':'https://raw.githubusercontent.com/vetherasset/branding/main/vader/vader-symbol-w-ring.png',
},
defaults.vader.conversionRate = 10000

defaults.xvader = {
	'chainId':defaults.network.chainId,
	'address':defaults.address.xvader,
	'name':'xVADER',
	'symbol':'xVADER',
	'decimals':18,
	'logoURI':'https://raw.githubusercontent.com/vetherasset/branding/main/xvader/xvader-symbol-w-ring.png',
},

defaults.usdv = {
	'chainId':defaults.network.chainId,
	'address':defaults.address.usdv,
	'name':'USDV',
	'symbol':'USDV',
	'decimals':18,
	'logoURI':'https://raw.githubusercontent.com/vetherasset/branding/main/usdv/usdv-symbol-w-ring.png',
}

defaults.vether = {
	'chainId':defaults.network.chainId,
	'address':defaults.address.vether,
	'name':'VETHER',
	'symbol':'VETH',
	'decimals':18,
	'logoURI':'https://raw.githubusercontent.com/vetherasset/branding/main/vether/vether-symbol-w-ring.png',
}

defaults.redeemables = [
	{
		...defaults.vether,
		'convertsTo':'VADER',
		'snapshot':snapshot,
		'salt':(
			isEthMainnet ? '13662469' :
				isEthTestnet ? '13662469' :
					undefined
		),
	},
	{
		...defaults.usdv,
		'convertsTo':'VADER',
		'disabled': true,
	},
	{
		...defaults.vader,
		'convertsTo':'USDV',
		'disabled': true,
	},
]

defaults.stakeable = [
	...[defaults.vader],
]

defaults.unstakeable = [
	...[defaults.xvader],
]

defaults.bonds = vaderBonds
defaults.bondConsideredSoldOutMinVader = ethers.BigNumber.from('300000000000000000000')
defaults.bondZapMinPayoutAllowed = '10000000000000000'

defaults.xVaderAPRBasedNumberOfRecords = 14

defaults.layout = {}
defaults.layout.header = {}
defaults.layout.header.width = '100%'
defaults.layout.header.padding = '1.2rem 1rem'
defaults.layout.header.minHeight = '98.4px'

defaults.layout.container = {}
defaults.layout.container.xl = {}
defaults.layout.container.xl.width = '75rem'
defaults.layout.container.lg = {}
defaults.layout.container.lg.width = '65rem'
defaults.layout.container.lg.padding = { base: '0 1.25rem', md: '0 2.5rem' }
defaults.layout.container.md = {}
defaults.layout.container.md.width = '840px'
defaults.layout.container.sm = {}
defaults.layout.container.sm.width = '768px'

defaults.toast = {}
defaults.toast.duration = 5000
defaults.toast.txHashDuration = 8000
defaults.toast.closable = true
defaults.toast.position = 'top'

export default defaults
