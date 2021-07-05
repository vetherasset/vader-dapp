module.exports = [
	{
		'inputs': [],
		'stateMutability': 'nonpayable',
		'type': 'constructor',
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
		'name': 'allocatedVADER',
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
		'name': 'checkReserve',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'getVaultReward',
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
				'name': 'recipient',
				'type': 'address',
			},
			{
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256',
			},
		],
		'name': 'grant',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': '_vader',
				'type': 'address',
			},
		],
		'name': 'init',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'lastGranted',
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
		'name': 'minGrantTime',
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
		'name': 'nextEraTime',
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
				'name': 'recipient',
				'type': 'address',
			},
			{
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256',
			},
		],
		'name': 'requestFunds',
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
		'inputs': [
			{
				'internalType': 'address',
				'name': 'base',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'recipient',
				'type': 'address',
			},
			{
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256',
			},
		],
		'name': 'requestFundsStrict',
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
		'inputs': [
			{
				'internalType': 'uint256',
				'name': 'newSplit',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'newDelay',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'newShare',
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
		'name': 'splitForUSDV',
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
		'name': 'unallocatedVADER',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'vaultShare',
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
]