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
				'name': 'curator',
				'type': 'address',
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
		],
		'name': 'Curated',
		'type': 'event',
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'base',
				'type': 'address',
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
				'name': 'amount',
				'type': 'uint256',
			},
		],
		'name': 'PoolReward',
		'type': 'event',
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
		'inputs': [],
		'name': 'accumulatedPrice',
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
				'internalType': 'uint256',
				'name': 'inputBase',
				'type': 'uint256',
			},
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
			{
				'internalType': 'uint256',
				'name': 'inputToken',
				'type': 'uint256',
			},
		],
		'name': 'addLiquidity',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256',
			},
		],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'anchorLimit',
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
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256',
			},
		],
		'name': 'arrayAnchors',
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
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256',
			},
		],
		'name': 'arrayPrices',
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
		'name': 'cachedIntervalAccumulatedPrice',
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
		'name': 'cachedIntervalTime',
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
		'name': 'curatePool',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'curatedPoolCount',
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
		'name': 'curatedPoolLimit',
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
		'name': 'emitting',
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
		'inputs': [],
		'name': 'getAnchorPrice',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': 'anchorPrice',
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
				'name': 'member',
				'type': 'address',
			},
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
		],
		'name': 'getILProtection',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': 'protection',
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
				'name': 'member',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
		],
		'name': 'getMemberBaseDeposit',
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
				'name': 'member',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
		],
		'name': 'getMemberLastDeposit',
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
				'name': 'member',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'token',
				'type': 'address',
			},
		],
		'name': 'getMemberTokenDeposit',
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
		'name': 'getTWAPPrice',
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
				'internalType': 'uint256',
				'name': 'vaderAmount',
				'type': 'uint256',
			},
		],
		'name': 'getUSDVAmount',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': 'USDVAmount',
				'type': 'uint256',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'uint256',
				'name': 'USDVAmount',
				'type': 'uint256',
			},
		],
		'name': 'getVADERAmount',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': 'vaderAmount',
				'type': 'uint256',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'insidePriceLimit',
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
		'name': 'intervalTWAP',
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
		'name': 'isBase',
		'outputs': [
			{
				'internalType': 'bool',
				'name': 'base',
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
		'name': 'isCurated',
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
		'name': 'isPool',
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
		'inputs': [],
		'name': 'lastUpdatedTime',
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
		'name': 'listAnchor',
		'outputs': [],
		'stateMutability': 'nonpayable',
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
		'name': 'mapAnchorAddress_arrayAnchorsIndex1',
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
			{
				'internalType': 'address',
				'name': '',
				'type': 'address',
			},
		],
		'name': 'mapMemberToken_depositBase',
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
			{
				'internalType': 'address',
				'name': '',
				'type': 'address',
			},
		],
		'name': 'mapMemberToken_depositToken',
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
			{
				'internalType': 'address',
				'name': '',
				'type': 'address',
			},
		],
		'name': 'mapMemberToken_lastDeposited',
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
		'name': 'outsidePriceLimit',
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
				'name': 'amountBase',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'amountToken',
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
				'name': 'oldToken',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'newToken',
				'type': 'address',
			},
		],
		'name': 'replaceAnchor',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'oldToken',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'newToken',
				'type': 'address',
			},
		],
		'name': 'replacePool',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'reserveUSDV',
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
		'name': 'reserveVADER',
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
		'name': 'rewardReductionFactor',
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
				'internalType': 'uint256',
				'name': 'newLimit',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'newInside',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'newOutside',
				'type': 'uint256',
			},
		],
		'name': 'setAnchorParams',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'uint256',
				'name': 'newFactor',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'newTime',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'newLimit',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'newInterval',
				'type': 'uint256',
			},
		],
		'name': 'setParams',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'startIntervalAccumulatedPrice',
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
		'name': 'startIntervalTime',
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
				'internalType': 'uint256',
				'name': 'inputAmount',
				'type': 'uint256',
			},
			{
				'internalType': 'address',
				'name': 'inputToken',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'outputToken',
				'type': 'address',
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
				'internalType': 'uint256',
				'name': 'inputAmount',
				'type': 'uint256',
			},
			{
				'internalType': 'address',
				'name': 'inputToken',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'outputToken',
				'type': 'address',
			},
			{
				'internalType': 'uint256',
				'name': 'slipLimit',
				'type': 'uint256',
			},
		],
		'name': 'swapWithLimit',
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
				'internalType': 'uint256',
				'name': 'inputAmount',
				'type': 'uint256',
			},
			{
				'internalType': 'address',
				'name': 'inputToken',
				'type': 'address',
			},
			{
				'internalType': 'bool',
				'name': 'inSynth',
				'type': 'bool',
			},
			{
				'internalType': 'address',
				'name': 'outputToken',
				'type': 'address',
			},
			{
				'internalType': 'bool',
				'name': 'outSynth',
				'type': 'bool',
			},
		],
		'name': 'swapWithSynths',
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
				'internalType': 'uint256',
				'name': 'inputAmount',
				'type': 'uint256',
			},
			{
				'internalType': 'address',
				'name': 'inputToken',
				'type': 'address',
			},
			{
				'internalType': 'bool',
				'name': 'inSynth',
				'type': 'bool',
			},
			{
				'internalType': 'address',
				'name': 'outputToken',
				'type': 'address',
			},
			{
				'internalType': 'bool',
				'name': 'outSynth',
				'type': 'bool',
			},
			{
				'internalType': 'uint256',
				'name': 'slipLimit',
				'type': 'uint256',
			},
		],
		'name': 'swapWithSynthsWithLimit',
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
		'name': 'timeForFullProtection',
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
		'name': 'updateAnchorPrice',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'updateTWAPPrice',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
]