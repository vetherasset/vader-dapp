import { ethers } from 'ethers'
import tokenListSources from '../tokenListSources.json'

const defaults = {}

defaults.network = {}
defaults.network.connector = undefined
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

defaults.network.tx = {}
defaults.network.tx.confirmations = 1

defaults.network.erc20 = {}
defaults.network.erc20.maxApproval = '302503999000000000299700000'

defaults.api = {}
defaults.api.graphUrl = 'https://api.thegraph.com/subgraphs/name/satoshi-naoki/vader-protocol'
defaults.api.etherscanUrl = (
	defaults.network.chainId === 1 ? 'https://etherscan.io/' :
		defaults.network.chainId === 42 ? 'https://kovan.etherscan.io/' :
			undefined
)
defaults.api.graphUrl2 = 'https://api.thegraph.com/subgraphs/name/0xchewbacca/x-vader'
defaults.api.etherscanApiUrl = (
	defaults.network.chainId === 1 ? 'https://api.etherscan.io/' :
		defaults.network.chainId === 42 ? 'https://api-kovan.etherscan.io' :
			undefined
)
defaults.api.etherscanApiKey = 'S5KA2VNKFI3I7RXXUG3SQJCEDGN7HPEJ89'

defaults.layout = {}

defaults.layout.header = {}
defaults.layout.header.width = '100%'
defaults.layout.header.padding = '1.2rem 1rem'
defaults.layout.header.minHeight = '98.4px'

defaults.layout.container = {}
defaults.layout.container.lg = {}
defaults.layout.container.lg.width = '75rem'
defaults.layout.container.lg.padding = { base: '0 1.25rem', md: '0 2.5rem' }
defaults.layout.container.md = {}
defaults.layout.container.md.width = '840px'
defaults.layout.container.sm = {}
defaults.layout.container.sm.width = '768px'

defaults.toast = {}
defaults.toast.duration = 5000
defaults.toast.closable = true
defaults.toast.position = 'top'

defaults.address = {}
defaults.address.vader = (
	defaults.network.chainId === 1 ? '' :
		defaults.network.chainId === 42 ? '0x1E6F42f04D64D55ec08d6D4e6A7CB4a235E1c742' :
			undefined
)
defaults.address.vether = (
	defaults.network.chainId === 1 ? '0x4Ba6dDd7b89ed838FEd25d208D4f644106E34279' :
		defaults.network.chainId === 42 ? '0x438f70ab08ab3f74833c439643c3fc1939ce2929' :
			undefined
)
defaults.address.converter = (
	defaults.network.chainId === 1 ? '' :
		defaults.network.chainId === 42 ? '0xF79c9406c14AF5Aa8b3F1E5E538A026aDf4D0ff5' :
			undefined
)
defaults.address.pool = (
	defaults.network.chainId === 1 ? '' :
		defaults.network.chainId === 42 ? '0xf780120f249Cd518309a2315b73288B05Ff6Abc3' :
			undefined
)
defaults.address.router = (
	defaults.network.chainId === 1 ? '' :
		defaults.network.chainId === 42 ? '0x784634B1c7136575D93Ce66Da3A14a9352015063' :
			undefined
)
defaults.address.fakeVader = (
	defaults.network.chainId === 1 ? '' :
		defaults.network.chainId === 42 ? '0xb0c3f757b1a62701835fb4e9175e9589ed5687fe' :
			undefined
)
defaults.address.xvader = (
	defaults.network.chainId === 1 ? '' :
		defaults.network.chainId === 42 ? '0x42980De4BF7926448ec75812955eB2762F067c30' :
			undefined
)

defaults.tokenList = {}
defaults.tokenList.default = 'https://raw.githubusercontent.com/vetherasset/vader-tokens/master/index.json'
defaults.tokenList.sources = tokenListSources

defaults.nativeAsset = {
	'chainId':3,
	'address': (
		defaults.network.chainId === 1 ? undefined :
			defaults.network.chainId === 42 ? '0xfd87ba583bd2071713fb5CB12086536a26eec18e' :
				undefined
	),
	'name':'USDV',
	'symbol':'USDV',
	'decimals':18,
	'logoURI':'https://assets.coingecko.com/coins/images/11375/thumb/vether-symbol-coingecko.png?1622341592',
}

defaults.tokenDefault = {
	'chainId':3,
	'address':'0x07865c6e87b9f70255377e024ace6630c1eaa37f',
	'name':'USDC',
	'symbol':'USDC',
	'decimals':6,
	'logoURI':'https://assets.coingecko.com/coins/images/11375/thumb/vether-symbol-coingecko.png?1622341592',
}

defaults.redeemables = [
	{
		'chainId':defaults.network.chainId,
		'address':defaults.address.vether,
		'name':'VETHER',
		'symbol':'VETH',
		'decimals':18,
		'logoURI':'https://assets.coingecko.com/coins/images/11375/thumb/vether-symbol-coingecko.png?1622341592',
		'convertsTo':'VADER',
	},
]

defaults.vader = {}
defaults.vader.conversionRate = 10000

export default defaults
