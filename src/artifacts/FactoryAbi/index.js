module.exports = [
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': '_pools',
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
				'name': 'token',
				'type': 'address',
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'pool',
				'type': 'address',
			},
		],
		'name': 'CreateSynth',
		'type': 'event',
	},
	{
		'inputs': [],
		'name': 'POOLS',
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
		'name': 'arraySynths',
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
		'name': 'deploySynth',
		'outputs': [
			{
				'internalType': 'address',
				'name': 'synth',
				'type': 'address',
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
		'name': 'getSynth',
		'outputs': [
			{
				'internalType': 'address',
				'name': 'synth',
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
		'name': 'isSynth',
		'outputs': [
			{
				'internalType': 'bool',
				'name': '_exists',
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
				'name': 'synth',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'member',
				'type': 'address',
			},
			{
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256',
			},
		],
		'name': 'mintSynth',
		'outputs': [
			{
				'internalType': 'bool',
				'name': '',
				'type': 'bool',
			},
		],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
]