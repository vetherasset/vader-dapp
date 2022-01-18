module.exports = [
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': '',
				'type': 'address',
			},
		],
		'name': 'balanceOf',
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
				'name': 'account',
				'type': 'address',
			},
			{
				'internalType': 'uint256',
				'name': 'uAmount',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'vAmount',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'exchangeFee',
				'type': 'uint256',
			},
		],
		'name': 'burn',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'uint256',
				'name': 'i',
				'type': 'uint256',
			},
		],
		'name': 'claim',
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
		'name': 'lbt',
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
				'name': '',
				'type': 'address',
			},
			{
				'internalType': 'uint256',
				'name': 'index',
				'type': 'uint256',
			},
		],
		'name': 'locks',
		'outputs': [
			{
				'components': [
					{
						'internalType': 'enum IUSDV.LockTypes',
						'name': 'token',
						'type': 'uint8',
					},
					{
						'internalType': 'uint256',
						'name': 'amount',
						'type': 'uint256',
					},
					{
						'internalType': 'uint256',
						'name': 'release',
						'type': 'uint256',
					},
				],
				'internalType': 'struct IUSDV.Lock',
				'name': '',
				'type': 'tuple',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'account',
				'type': 'address',
			},
			{
				'internalType': 'uint256',
				'name': 'vAmount',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'uAmount',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'exchangeFee',
				'type': 'uint256',
			},
		],
		'name': 'mint',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'minter',
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
				'name': '_lbt',
				'type': 'address',
			},
		],
		'name': 'setLBTwap',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': '_minter',
				'type': 'address',
			},
		],
		'name': 'setMinter',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'validator',
				'type': 'address',
			},
		],
		'name': 'setValidator',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'vader',
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
		'name': 'validator',
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
]