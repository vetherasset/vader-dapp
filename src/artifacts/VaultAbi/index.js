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
				'name': 'asset',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'reward',
				'type': 'uint256',
			},
		],
		'name': 'Harvests',
		'type': 'event',
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'asset',
				'type': 'address',
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'member',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'weight',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'totalWeight',
				'type': 'uint256',
			},
		],
		'name': 'MemberDeposits',
		'type': 'event',
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'asset',
				'type': 'address',
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'member',
				'type': 'address',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'weight',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'totalWeight',
				'type': 'uint256',
			},
		],
		'name': 'MemberWithdraws',
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
				'name': 'asset',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': 'member',
				'type': 'address',
			},
		],
		'name': 'calcDepositValueForMember',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': 'value',
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
				'name': 'asset',
				'type': 'address',
			},
		],
		'name': 'calcRewardForAsset',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': 'reward',
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
				'name': 'asset',
				'type': 'address',
			},
			{
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256',
			},
		],
		'name': 'deposit',
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
				'name': 'asset',
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
		'name': 'depositForMember',
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
				'name': 'asset',
				'type': 'address',
			},
		],
		'name': 'getAssetDeposit',
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
				'name': 'asset',
				'type': 'address',
			},
		],
		'name': 'getAssetLastTime',
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
				'name': 'asset',
				'type': 'address',
			},
		],
		'name': 'getMemberDeposit',
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
				'name': 'asset',
				'type': 'address',
			},
		],
		'name': 'getMemberLastTime',
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
		],
		'name': 'getMemberWeight',
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
				'name': 'asset',
				'type': 'address',
			},
		],
		'name': 'harvest',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': 'reward',
				'type': 'uint256',
			},
		],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'minimumDepositTime',
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
				'name': 'newDepositTime',
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
		'name': 'totalWeight',
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
				'name': 'asset',
				'type': 'address',
			},
			{
				'internalType': 'uint256',
				'name': 'basisPoints',
				'type': 'uint256',
			},
		],
		'name': 'withdraw',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': 'redeemedAmount',
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
				'name': 'asset',
				'type': 'address',
			},
			{
				'internalType': 'uint256',
				'name': 'basisPoints',
				'type': 'uint256',
			},
		],
		'name': 'withdrawToVader',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': 'redeemedAmount',
				'type': 'uint256',
			},
		],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
]