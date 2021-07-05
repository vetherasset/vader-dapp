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
				'name': 'collateralAsset',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'collateralLocked',
				'type': 'uint256',
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'debtAsset',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'debtIssued',
				'type': 'uint256',
			},
		],
		'name': 'AddCollateral',
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
				'name': 'collateralAsset',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'collateralUnlocked',
				'type': 'uint256',
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'debtAsset',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'debtReturned',
				'type': 'uint256',
			},
		],
		'name': 'RemoveCollateral',
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
		'inputs': [
			{
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256',
			},
			{
				'internalType': 'address',
				'name': 'collateralAsset',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'debtAsset',
				'type': 'address',
			},
		],
		'name': 'borrow',
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
				'name': 'member',
				'type': 'address',
			},
			{
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256',
			},
			{
				'internalType': 'address',
				'name': 'collateralAsset',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'debtAsset',
				'type': 'address',
			},
		],
		'name': 'borrowForMember',
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
		'name': 'checkLiquidate',
		'outputs': [],
		'stateMutability': 'nonpayable',
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
		'inputs': [
			{
				'internalType': 'address',
				'name': 'member',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'collateralAsset',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'debtAsset',
				'type': 'address',
			},
		],
		'name': 'getMemberCollateral',
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
				'name': 'collateralAsset',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'debtAsset',
				'type': 'address',
			},
		],
		'name': 'getMemberDebt',
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
				'name': 'collateralAsset',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'debtAsset',
				'type': 'address',
			},
		],
		'name': 'getNextEraTime',
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
				'name': 'collateralAsset',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'debtAsset',
				'type': 'address',
			},
		],
		'name': 'getSystemCollateral',
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
				'name': 'collateralAsset',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'debtAsset',
				'type': 'address',
			},
		],
		'name': 'getSystemDebt',
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
				'name': 'collateralAsset',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'debtAsset',
				'type': 'address',
			},
		],
		'name': 'getSystemInterestPaid',
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
		'inputs': [
			{
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256',
			},
			{
				'internalType': 'address',
				'name': 'collateralAsset',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'debtAsset',
				'type': 'address',
			},
		],
		'name': 'repay',
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
				'name': 'member',
				'type': 'address',
			},
			{
				'internalType': 'uint256',
				'name': 'basisPoints',
				'type': 'uint256',
			},
			{
				'internalType': 'address',
				'name': 'collateralAsset',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'debtAsset',
				'type': 'address',
			},
		],
		'name': 'repayForMember',
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
]