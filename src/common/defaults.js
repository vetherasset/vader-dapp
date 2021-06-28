import { ethers } from 'ethers'

const defaults = {}

defaults.network = {}
defaults.network.connector = undefined
// defaults.network.chainId = Number(process.env.REACT_APP_CHAIN_ID)
// ropsten
defaults.network.chainId = 3
defaults.network.provider = new ethers.providers.WebSocketProvider(
	process.env.REACT_APP_WS_URL,
	defaults.network.chainId,
)

defaults.user = { account: '' }

defaults.contract = {}
defaults.contract.vader = '0xe1e6f994E01B66B4787622Be050BD0d58a578Ff1'
defaults.contract.vether = '0xF89082707F9f97cCE14400f1F6D7456855B506EE'
defaults.contract.usdv = '0xC9c95dC1560e504Ade008bc74fB371b3AbDB97cF'
defaults.contract.vault = '0xAd34302778D01eA81fc5C984E8A7C32C5955a484'

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
