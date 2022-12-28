module.exports = [
	{
		'inputs': [
			{
				'internalType': 'contract IERC20',
				'name': '_token',
				'type': 'address',
			},
			{
				'internalType': 'bytes32',
				'name': '_root',
				'type': 'bytes32',
			},
			{
				'internalType': 'uint256',
				'name': '_salt',
				'type': 'uint256',
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
				'name': 'account',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'bytes32',
				'name': 'leaf',
				'type': 'bytes32',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256',
			},
		],
		'name': 'Claim',
		'type': 'event',
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'previousOwner',
				'type': 'address',
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'newOwner',
				'type': 'address',
			},
		],
		'name': 'OwnershipTransferred',
		'type': 'event',
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
				'name': 'amount',
				'type': 'uint256',
			},
			{
				'internalType': 'bytes32[]',
				'name': 'proof',
				'type': 'bytes32[]',
			},
		],
		'name': 'claim',
		'outputs': [],
		'stateMutability': 'nonpayable',
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
				'name': 'amount',
				'type': 'uint256',
			},
		],
		'name': 'claimed',
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
		'name': 'owner',
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
		'name': 'renounceOwnership',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'root',
		'outputs': [
			{
				'internalType': 'bytes32',
				'name': '',
				'type': 'bytes32',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'salt',
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
		'name': 'token',
		'outputs': [
			{
				'internalType': 'contract IERC20',
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
				'name': 'newOwner',
				'type': 'address',
			},
		],
		'name': 'transferOwnership',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'withdraw',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
]
