module.exports = [
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': '_vader',
				'type': 'address',
			},
		],
		'stateMutability': 'nonpayable',
		'type': 'constructor',
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'member',
				'type': 'address',
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'base',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'baseAmount',
				'type': 'uint256',
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'tokenAmount',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'liquidityUnits',
				'type': 'uint256',
			},
		],
		'name': 'AddLiquidity',
		'type': 'event',
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'member',
				'type': 'address',
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'base',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'baseAmount',
				'type': 'uint256',
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'synthAmount',
				'type': 'uint256',
			},
		],
		'name': 'BurnSynth',
		'type': 'event',
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'member',
				'type': 'address',
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'base',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'baseAmount',
				'type': 'uint256',
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'synthAmount',
				'type': 'uint256',
			},
		],
		'name': 'MintSynth',
		'type': 'event',
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'member',
				'type': 'address',
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'base',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'baseAmount',
				'type': 'uint256',
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'tokenAmount',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'liquidityUnits',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'totalUnits',
				'type': 'uint256',
			},
		],
		'name': 'RemoveLiquidity',
		'type': 'event',
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'member',
				'type': 'address',
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'inputToken',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'inputAmount',
				'type': 'uint256',
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'outputToken',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'outputAmount',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'swapFee',
				'type': 'uint256',
			},
		],
		'name': 'Swap',
		'type': 'event',
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'pool',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'addedAmount',
				'type': 'uint256',
			},
		],
		'name': 'Sync',
		'type': 'event',
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'burntSynth',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'deletedUnits',
				'type': 'uint256',
			},
		],
		'name': 'SynthSync',
		'type': 'event',
	},
	{
		'inputs': [],
		'name': 'UTILS',
		'outputs': [
			{
				'internalType': 'address',
				'name': '',
				'type': 'address',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'VADER',
		'outputs': [
			{
				'internalType': 'address',
				'name': '',
				'type': 'address',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'base',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'member',
				'type': 'address',
			},
		],
		'name': 'addLiquidity',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': 'liquidityUnits',
				'type': 'uint256',
			},
		],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'member',
				'type': 'address',
			},
		],
		'name': 'burnSynth',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': 'outputBase',
				'type': 'uint256',
			},
		],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
		],
		'name': 'deploySynth',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
		],
		'name': 'getBaseAmount',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'member',
				'type': 'address',
			},
		],
		'name': 'getMemberUnits',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
		],
		'name': 'getPoolAmounts',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
		],
		'name': 'getSynth',
		'outputs': [
			{
				'internalType': 'address',
				'name': '',
				'type': 'address',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
		],
		'name': 'getTokenAmount',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
		],
		'name': 'getUnits',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
		],
		'name': 'isAnchor',
		'outputs': [
			{
				'internalType': 'bool',
				'name': '',
				'type': 'bool',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
		],
		'name': 'isAsset',
		'outputs': [
			{
				'internalType': 'bool',
				'name': '',
				'type': 'bool',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
		],
		'name': 'isSynth',
		'outputs': [
			{
				'internalType': 'bool',
				'name': '',
				'type': 'bool',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': '',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': '',
				'type': 'address',
			},
		],
		'name': 'mapTokenMember_Units',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': '',
				'type': 'address',
			},
		],
		'name': 'mapToken_Units',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': '',
				'type': 'address',
			},
		],
		'name': 'mapToken_baseAmount',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': '',
				'type': 'address',
			},
		],
		'name': 'mapToken_tokenAmount',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'member',
				'type': 'address',
			},
		],
		'name': 'mintSynth',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': 'outputAmount',
				'type': 'uint256',
			},
		],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'pooledUSDV',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'pooledVADER',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'base',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
			{
				'internalType': 'uint256',
				'name': 'basisPoints',
				'type': 'uint256',
			},
			{
				'internalType': 'address',
				'name': 'member',
				'type': 'address',
			},
		],
		'name': 'removeLiquidity',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': 'units',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'outputBase',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'outputToken',
				'type': 'uint256',
			},
		],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'base',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'member',
				'type': 'address',
			},
			{
				'internalType': 'bool',
				'name': 'toBase',
				'type': 'bool',
			},
		],
		'name': 'swap',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': 'outputAmount',
				'type': 'uint256',
			},
		],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'pool',
				'type': 'address',
			},
		],
		'name': 'sync',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
		],
		'name': 'syncSynth',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
]