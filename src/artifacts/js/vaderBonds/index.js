const bonds = [
	{
		'name': 'Uniswap V2 VADER / ETH LP',
		'address':'0x1b96d82b8b13c75d4ce347a53284b10d93b63684',
		'zap': '0x781b2844605298fb45c653dc1ef0d0b941293323',
		'principal': {
			'address':'0x452c60e1e3ae0965cd27db1c7b3a525d197ca0aa',
			'name':'Uniswap VADER/ETH LP',
			'symbol':'UNI-V2',
			'decimals':18,
		},
		'token0': {
			'address':'0x2602278ee1882889b946eb11dc0e810075650983',
			'name':'VADER',
			'symbol':'VADER',
			'decimals':18,
			'logoURI':'https://raw.githubusercontent.com/vetherasset/branding/main/vader/vader-symbol-w-ring.png',
		},
		'token1': {
			'name':'ETHER',
			'symbol':'ETH',
			'decimals':18,
			'isEther':true,
			'logoURI':'https://raw.githubusercontent.com/vetherasset/vader-dapp/65a55cc1d1e89e1549b3d119d296ac8d701a37ea/src/assets/png/eth-diamond-purple-purple.png',
		},
		'payout': {
			'address':'0x2602278ee1882889b946eb11dc0e810075650983',
			'name':'VADER',
			'symbol':'VADER',
			'decimals':18,
			'logoURI':'https://raw.githubusercontent.com/vetherasset/branding/main/vader/vader-symbol-w-ring.png',
		},
	},
]

const bondsKovan = [
	{
		...bonds[0],
		'address':'0xd932cc11F49df7638999E2a313e5808667363750',
		'zap':'0x6D51Ef96C362fdea02c61Ce2dD1A263B5ABbd4B9',
		'principal': {
			...bonds[0].principal,
			'address':'0xC42706E83433580dd8d865a30e2Ae61082056007',
		},
		'token0': {
			...bonds[0].token0,
			'address':'0xB46dbd07ce34813623FB0643b21DCC8D0268107D',
		},
		'payout': {
			...bonds[0].payout,
			'address':'0xB46dbd07ce34813623FB0643b21DCC8D0268107D',
		},
	},
]

export { bonds, bondsKovan }