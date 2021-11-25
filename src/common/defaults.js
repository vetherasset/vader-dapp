import { ethers } from 'ethers'
import tokenListSources from '../tokenListSources.json'
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
defaults.api.graphUrl = 'https://api.thegraph.com/subgraphs/name/satoshi-naoki/vader-protocol'
defaults.api.etherscanUrl = (
	defaults.network.chainId === 1 ? 'https://etherscan.io/' :
		defaults.network.chainId === 42 ? 'https://kovan.etherscan.io/' :
			undefined
)

defaults.address = {}
defaults.address.vader = (
	defaults.network.chainId === 1 ? '' :
		defaults.network.chainId === 42 ? '0x237E9d2F4d4834fD3fCB0ECdeE912682F5D24984' :
			undefined
)
defaults.address.vether = (
	defaults.network.chainId === 1 ? '0x4Ba6dDd7b89ed838FEd25d208D4f644106E34279' :
		defaults.network.chainId === 42 ? '0x4402a7c8829489705852e54da50ebec60c8c86a8' :
			undefined
)
defaults.address.xvader = (
	defaults.network.chainId === 1 ? '' :
		defaults.network.chainId === 42 ? '0x8238Fd02096e408E60767F06DE1bB0B3934C5a8A' :
			undefined
)
defaults.address.usdv = (
	defaults.network.chainId === 1 ? undefined :
		defaults.network.chainId === 42 ? '0xfd87ba583bd2071713fb5CB12086536a26eec18e' :
			undefined
),
defaults.address.converter = (
	defaults.network.chainId === 1 ? '' :
		defaults.network.chainId === 42 ? '0x0886Bc7CFB73C912130a4A425b12336227A96723' :
			undefined
)
defaults.address.linearVesting = (
	defaults.network.chainId === 1 ? '' :
		defaults.network.chainId === 42 ? '0x09750166d8f3c1e6f5ff762fa58e831fe3bc46b1' :
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

defaults.tokenList = {}
defaults.tokenList.default = 'https://raw.githubusercontent.com/vetherasset/vader-tokens/master/index.json'
defaults.tokenList.sources = tokenListSources

defaults.vader = {}
defaults.vader.conversionRate = 10000

defaults.nativeAsset = {
	'chainId':defaults.network.chainId,
	'address':defaults.address.usdv,
	'name':'USDV',
	'symbol':'USDV',
	'decimals':18,
	'logoURI':'https://raw.githubusercontent.com/vetherasset/branding/main/usdv/usdv-symbol-w-ring.png',
}

defaults.tokenDefault = {
	'chainId':defaults.network.chainId,
	'address':defaults.address.usdv,
	'name':'USDV',
	'symbol':'USDV',
	'decimals':18,
	'logoURI':'https://raw.githubusercontent.com/vetherasset/branding/main/usdv/usdv-symbol-w-ring.png',
}

defaults.redeemables = [
	{
		'chainId':defaults.network.chainId,
		'address':defaults.address.vether,
		'name':'VETHER',
		'symbol':'VETH',
		'decimals':18,
		'logoURI':'https://raw.githubusercontent.com/vetherasset/branding/main/vether/vether-symbol-w-ring.png',
		'convertsTo':'VADER',
		'snapshot':snapshot,
		'salt':(
			defaults.network.chainId === 1 ? '13662469' :
				defaults.network.chainId === 42 ? '13662469' :
					undefined
		),
	},
]

defaults.stakeable = [
	{
		'chainId':defaults.network.chainId,
		'address':defaults.address.vader,
		'name':'VADER',
		'symbol':'VADER',
		'decimals':18,
		'logoURI':'https://raw.githubusercontent.com/vetherasset/branding/main/vader/vader-symbol-w-ring.png',
	},
]

defaults.unstakeable = [
	{
		'chainId':defaults.network.chainId,
		'address':defaults.address.xvader,
		'name':'xVADER',
		'symbol':'xVADER',
		'decimals':18,
		'logoURI':'https://raw.githubusercontent.com/vetherasset/branding/main/vader/vader-symbol-w-ring.png',
	},
]

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
