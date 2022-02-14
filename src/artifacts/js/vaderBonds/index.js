const bonds = [
	{
		'name': 'Uniswap V2 VADER / ETH LP',
		'address':'0x1b96d82b8b13c75d4ce347a53284b10d93b63684',
		'zap': '0x781b2844605298fb45c653dc1ef0d0b941293323',
		'precommit': undefined,
		'precommitzap': undefined,
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
	{
		'name': 'ETH Reserve Bond Short Term',
		'address':'0x74876acb3D2a007687c285B5A75A0d7b470B3D69',
		'zap': undefined,
		'precommit': '0x0c6ad91DD183f953389D0bf5687025340a19E6e0',
		'precommitzap': '0xdfdbeFa9A5E93a369cd0fCcA7820C5C5caB3082f',
		'principal': undefined,
		'token0': {
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
	{
		'name': 'ETH Reserve Bond Long Term',
		'address':'0xbea19c6AB7F5C90481147Ad69Ff0De2Dba879b5C',
		'zap': undefined,
		'precommit': '0x3db19DE4263284c957B09efe53Cb0e7042228C59',
		'precommitzap': '0xD936219f3acA9CA1fa675aA69752FaD2BE85A90a',
		'principal': undefined,
		'token0': {
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
		'address':'0xa8ac19c394783eacdd36e53686db037715c87fcd',
		'zap':'0x6D51Ef96C362fdea02c61Ce2dD1A263B5ABbd4B9',
		'precommit':'0x4d9db98d2914c15ee0295f23ce9cb37626a89b36',
		'precommitzap':'0xa23b68d6c651db60145ab47d9e4790ab13a62a29',
		'principal': {
			...bonds[0].principal,
			'address':'0xd0a1e359811322d97991e03f863a0c30c2cf029c',
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