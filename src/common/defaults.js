import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ethers } from 'ethers'
import tokenListSources from '../tokenListSources'
import vaderBonds from '../artifacts/js/vaderBonds'
import vaderTokens from '../artifacts/json/vaderTokens'
import snapshot from '../artifacts/json/vetherSnapshot'

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
	],
)

defaults.network.tx = {}
defaults.network.tx.confirmations = 1

defaults.network.erc20 = {}
defaults.network.erc20.maxApproval = '302503999000000000299700000'

defaults.api = {}
defaults.api.graphql = {}
defaults.api.graphql.uri = {}
defaults.api.graphql.uri.vaderProtocol = (
	defaults.network.chainId === 1 ? 'https://api.thegraph.com/subgraphs/name/satoshi-naoki/vader-protocol-mainnet' :
		defaults.network.chainId === 42 ? 'https://api.thegraph.com/subgraphs/name/satoshi-naoki/vader-protocol' :
			undefined
)
defaults.api.graphql.client = new ApolloClient({
	uri: defaults.api.graphql.uri.vaderProtocol,
	cache: new InMemoryCache(),
})
defaults.api.graphql.pollInterval = 100000

defaults.api.etherscanUrl = (
	defaults.network.chainId === 1 ? 'https://etherscan.io/' :
		defaults.network.chainId === 42 ? 'https://kovan.etherscan.io/' :
			undefined
)

defaults.address = {}
defaults.address.vader = (
	defaults.network.chainId === 1 ? '0x2602278EE1882889B946eb11DC0E810075650983' :
		defaults.network.chainId === 42 ? '0x1fd03e4eA209497910fACE52e5ca39124ef2E8BE' :
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
	defaults.network.chainId === 1 ? undefined :
		defaults.network.chainId === 42 ? '0xfd87ba583bd2071713fb5CB12086536a26eec18e' :
			undefined
),
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

defaults.tokenList = {}
defaults.tokenList.default = vaderTokens
defaults.tokenList.sources = tokenListSources

defaults.ether = {
	'name':'ETHER',
	'symbol':'ETH',
	'decimals':18,
	'logoURI':'https://raw.githubusercontent.com/vetherasset/vader-dapp/65a55cc1d1e89e1549b3d119d296ac8d701a37ea/src/assets/png/eth-diamond-purple-purple.png',
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
			defaults.network.chainId === 1 ? '13662469' :
				defaults.network.chainId === 42 ? '13662469' :
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

defaults.xVaderAPRBasedNumberOfRecords = 3

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

defaults.swap = {}
defaults.swap.slippage = 0.5
defaults.swap.minSlippage = 0.05
defaults.swap.maxSlippage = 1
defaults.swap.deadline = 30
defaults.swap.minDeadline = 1
defaults.swap.maxDeadline = 180

export default defaults
