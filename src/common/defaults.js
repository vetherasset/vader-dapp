import { ethers } from 'ethers'

const defaults = {}

defaults.network = {}
defaults.network.connector = undefined
defaults.network.chainId = Number(process.env.REACT_APP_CHAIN_ID)

defaults.network.provider = new ethers.providers.WebSocketProvider(
	process.env.REACT_APP_WS_URL,
	defaults.network.chainId,
)

defaults.layout = {}

defaults.layout.header = {}
defaults.layout.header.width = '100%'
defaults.layout.header.padding = '1.2rem 1rem'
defaults.layout.header.minHeight = '98.4px'

defaults.layout.container = {}
defaults.layout.container.lg = {}
defaults.layout.container.lg.width = '75rem'
defaults.layout.container.lg.padding = { base: '0 1.25rem', md: '0 2.5rem' }
defaults.layout.container.sm = {}
defaults.layout.container.sm.width = '768px'

defaults.toast = {}
defaults.toast.duration = 5000
defaults.toast.closable = true
defaults.toast.position = 'top'

defaults.address = {}
defaults.address.vader = defaults.network.chainId === 1 ? ''
	: defaults.network.chainId === 3 ? '0x9bee02113c21ad204c6a08Dd22a921aC86CA69e5'
		: undefined
defaults.address.usdv = defaults.network.chainId === 1 ? ''
	: defaults.network.chainId === 3 ? '0x6077a249ADfc542a87C0F18a29deEfA1e85A7aab'
	 : undefined
defaults.address.vether = defaults.network.chainId === 1 ? '0x4Ba6dDd7b89ed838FEd25d208D4f644106E34279'
	: defaults.network.chainId === 3 ? '0xA7764B95123D8c7680eBbA3F2dd7DB459E6EcdC6'
	 : undefined

defaults.tokenList = 'https://raw.githubusercontent.com/vetherasset/vader-tokens/master/index.json'
defaults.tokenDefault = {
	'chainId':3,
	'address':'0x07865c6e87b9f70255377e024ace6630c1eaa37f',
	'name':'USDC',
	'symbol':'USDC',
	'decimals':6,
	'logoURI':'https://assets.coingecko.com/coins/images/11375/thumb/vether-symbol-coingecko.png?1622341592',
}

export default defaults
