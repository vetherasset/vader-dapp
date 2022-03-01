import { ApolloClient, InMemoryCache } from '@apollo/client'
import { QueryClient } from 'react-query'
import { ethers } from 'ethers'
import tokenListSources from '../tokenListSources'
import vaderTokens from '../artifacts/json/vaderTokens'
import { bonds, bondsKovan } from '../artifacts/js/vaderBonds'
import snapshot from '../artifacts/json/vetherSnapshot'

const defaults = {}

defaults.network = {}
defaults.network.chainId = Number(process.env.REACT_APP_CHAIN_ID)
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
		{
			provider: new ethers.providers.InfuraProvider(
				defaults.network.chainId,
				process.env.REACT_APP_INFURA_KEY,
			),
			weight: 1,
			priority: 2,
			stallTimeout: 2000,
		},
	],
	1,
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
			defaults.network.chainId === 1 ?
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
				defaults.network.chainId === 1 ?
					`https://eth-mainnet.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY}` :
					defaults.network.chainId === 42 ?
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
defaults.network.tx.confirmations = 2

defaults.network.blockTime = {}
defaults.network.blockTime.second = (
	defaults.network.chainId === 1 ? 0.07570023 :
		defaults.network.chainId === 42 ? 0.25 :
			0)
defaults.network.blockTime.minute = defaults.network.blockTime.second * 60
defaults.network.blockTime.hour = defaults.network.blockTime.minute * 60
defaults.network.blockTime.day = defaults.network.blockTime.hour * 24

defaults.network.erc20 = {}
defaults.network.erc20.maxApproval = '302503999000000000299700000'

defaults.api = {}
defaults.api.staleTime = 100000
defaults.api.client = new QueryClient()

defaults.api.graphql = {}
defaults.api.graphql.uri = {}
defaults.api.graphql.uri.vaderProtocol = (
	defaults.network.chainId === 1 ? 'https://api.thegraph.com/subgraphs/name/satoshi-naoki/vader-protocol-mainnet' :
		defaults.network.chainId === 42 ? 'https://api.thegraph.com/subgraphs/name/satoshi-naoki/vader-protocol' :
			undefined
)
defaults.api.graphql.uri.uniswapV2 = (
	defaults.network.chainId === 1 ? 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2' :
		defaults.network.chainId === 42 ? 'https://api.thegraph.com/subgraphs/name/sc0vu/uniswap-v2-kovan' :
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
	defaults.network.chainId === 1 ? 'https://etherscan.io' :
		defaults.network.chainId === 42 ? 'https://kovan.etherscan.io' :
			undefined
)

defaults.address = {}
defaults.address.vader = (
	defaults.network.chainId === 1 ? '0x2602278ee1882889b946eb11dc0e810075650983' :
		defaults.network.chainId === 42 ? '0xcCb3AeF7Baa506e2D05193e38e88459F68AC1a8F' :
			undefined
)
defaults.address.vether = (
	defaults.network.chainId === 1 ? '0x4Ba6dDd7b89ed838FEd25d208D4f644106E34279' :
		defaults.network.chainId === 42 ? '0x4402a7c8829489705852e54da50ebec60c8c86a8' :
			undefined
)
defaults.address.xvader = (
	defaults.network.chainId === 1 ? '0x665ff8fAA06986Bd6f1802fA6C1D2e7d780a7369' :
		defaults.network.chainId === 42 ? '0x0AA1056Ee563C14484fCC530625cA74575C97512' :
			undefined
)
defaults.address.usdv = (
	defaults.network.chainId === 1 ? '0xea3Fb6f331735252E7Bfb0b24b3B761301293DBe' :
		defaults.network.chainId === 42 ? '0xF5783253A21E5E740908CEdB800183b70A004479' :
			undefined
),
defaults.address.wrappedEth = (
	defaults.network.chainId === 1 ? '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' :
		undefined
)
defaults.address.converter = (
	defaults.network.chainId === 1 ? '0x6D4a43Ee4770a2Bab97460d3a3B783641D85d108' :
		defaults.network.chainId === 42 ? '0x8A313Fa0cb3ed92bE4Cae3a4deF7C32c78181E09' :
			undefined
)
defaults.address.linearVesting = (
	defaults.network.chainId === 1 ? '0xb3C600C04AaF603b0f422b73Db244216C2e491f6' :
		defaults.network.chainId === 42 ? '0xDaA4B82D5Bdd315a3191B080E26ff7A88eb8034E' :
			undefined
)

defaults.address.uniswapV2 = {}
defaults.address.uniswapV2.vaderEthPair = (
	defaults.network.chainId === 1 ? '0x452c60e1e3ae0965cd27db1c7b3a525d197ca0aa' :
		defaults.network.chainId === 42 ? '0xC42706E83433580dd8d865a30e2Ae61082056007' :
			undefined
)
defaults.address.uniswapV2.usdcEthPair = (
	defaults.network.chainId === 1 ? '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc' :
		defaults.network.chainId === 42 ? '0x00ba37fd79ba75b631e74de45299bb8021611e22' :
			undefined
)
defaults.address.usdv3crvf = (
	defaults.network.chainId === 1 ? '0x7abD51BbA7f9F6Ae87aC77e1eA1C5783adA56e5c' :
		undefined
)
defaults.address.stakingRewards = (
	defaults.network.chainId === 1 ? '0x2413e4594aadE7513AB6Dc43209D4C312cC35121' :
		undefined
)

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

defaults.usdv3crvf = {
	'chainId':defaults.network.chainId,
	'address':defaults.address.usdv3crvf,
	'name':'USDV3CRV-f',
	'symbol':'USDV3CRV-f',
	'decimals':18,
}

defaults.redeemables = [
	{
		...defaults.vether,
		'convertsTo':defaults.vader,
		'snapshot':snapshot,
		'salt':(
			defaults.network.chainId === 1 ? '13662469' :
				defaults.network.chainId === 42 ? '13662469' :
					undefined
		),
	},
	{
		...defaults.usdv,
		'convertsTo':defaults.vader,
		'disabled': false,
	},
	{
		...defaults.vader,
		'convertsTo':defaults.usdv,
		'disabled': false,
	},
]

defaults.stakeable = [
	...[defaults.vader],
]

defaults.unstakeable = [
	...[defaults.xvader],
]

defaults.bonds = defaults.network.chainId === 1 ? bonds :
	defaults.network.chainId === 42 ? bondsKovan :
		[]

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
