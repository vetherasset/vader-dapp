module.exports = [
	{
		'inputs': [],
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
				'internalType': 'uint256',
				'name': 'oldProposalID',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'oldVotes',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'newVotes',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'totalWeight',
				'type': 'uint256',
			},
		],
		'name': 'CancelProposal',
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
				'internalType': 'uint256',
				'name': 'proposalID',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'votesCast',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'totalWeight',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'string',
				'name': 'proposalType',
				'type': 'string',
			},
		],
		'name': 'FinalisedProposal',
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
				'internalType': 'uint256',
				'name': 'proposalID',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'string',
				'name': 'proposalType',
				'type': 'string',
			},
		],
		'name': 'NewProposal',
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
				'internalType': 'uint256',
				'name': 'proposalID',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'voteWeight',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'totalVotes',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'string',
				'name': 'proposalType',
				'type': 'string',
			},
		],
		'name': 'NewVote',
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
				'internalType': 'uint256',
				'name': 'proposalID',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'timeFinalised',
				'type': 'uint256',
			},
			{
				'indexed': false,
				'internalType': 'string',
				'name': 'proposalType',
				'type': 'string',
			},
		],
		'name': 'ProposalFinalising',
		'type': 'event',
	},
	{
		'inputs': [],
		'name': 'COUNCIL',
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
		'name': 'FACTORY',
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
		'name': 'LENDER',
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
		'inputs': [],
		'name': 'RESERVE',
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
		'name': 'ROUTER',
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
		'name': 'USDV',
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
		'inputs': [],
		'name': 'VAULT',
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
		'name': 'VETHER',
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
				'name': 'oldProposalID',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'newProposalID',
				'type': 'uint256',
			},
		],
		'name': 'cancelProposal',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'newCouncil',
				'type': 'address',
			},
		],
		'name': 'changeCouncil',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'coolOffPeriod',
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
				'name': 'proposalID',
				'type': 'uint256',
			},
		],
		'name': 'finaliseProposal',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'uint256',
				'name': '_proposalID',
				'type': 'uint256',
			},
			{
				'internalType': 'address',
				'name': 'member',
				'type': 'address',
			},
		],
		'name': 'getMemberVotes',
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
				'name': '_proposalID',
				'type': 'uint256',
			},
		],
		'name': 'getPIDType',
		'outputs': [
			{
				'internalType': 'string',
				'name': '',
				'type': 'string',
			},
		],
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'uint256',
				'name': '_proposalID',
				'type': 'uint256',
			},
		],
		'name': 'getVotes',
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
				'name': '_proposalID',
				'type': 'uint256',
			},
		],
		'name': 'hasMajority',
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
				'name': '_proposalID',
				'type': 'uint256',
			},
		],
		'name': 'hasMinority',
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
				'name': '_proposalID',
				'type': 'uint256',
			},
		],
		'name': 'hasQuorum',
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
				'name': '_vether',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': '_vader',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': '_usdv',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': '_reserve',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': '_vault',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': '_router',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': '_lender',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': '_pools',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': '_factory',
				'type': 'address',
			},
			{
				'internalType': 'address',
				'name': '_utils',
				'type': 'address',
			},
		],
		'name': 'init',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256',
			},
			{
				'internalType': 'address',
				'name': '',
				'type': 'address',
			},
		],
		'name': 'mapPIDMember_votes',
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
		'name': 'mapPID_address',
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
		'name': 'mapPID_finalised',
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
				'name': '',
				'type': 'uint256',
			},
		],
		'name': 'mapPID_finalising',
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
				'name': '',
				'type': 'uint256',
			},
		],
		'name': 'mapPID_grant',
		'outputs': [
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
		'name': 'mapPID_params',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': 'p1',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'p2',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'p3',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'p4',
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
		'name': 'mapPID_timeStart',
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
		'name': 'mapPID_type',
		'outputs': [
			{
				'internalType': 'string',
				'name': '',
				'type': 'string',
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
		'name': 'mapPID_votes',
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
				'internalType': 'string',
				'name': 'typeStr',
				'type': 'string',
			},
		],
		'name': 'newActionProposal',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'string',
				'name': 'typeStr',
				'type': 'string',
			},
			{
				'internalType': 'address',
				'name': 'proposedAddress',
				'type': 'address',
			},
		],
		'name': 'newAddressProposal',
		'outputs': [],
		'stateMutability': 'nonpayable',
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
		'name': 'newGrantProposal',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'string',
				'name': 'typeStr',
				'type': 'string',
			},
			{
				'internalType': 'uint256',
				'name': 'p1',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'p2',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'p3',
				'type': 'uint256',
			},
			{
				'internalType': 'uint256',
				'name': 'p4',
				'type': 'uint256',
			},
		],
		'name': 'newParamProposal',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [],
		'name': 'proposalCount',
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
		'name': 'purgeCouncil',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'internalType': 'uint256',
				'name': 'proposalID',
				'type': 'uint256',
			},
		],
		'name': 'voteProposal',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': 'voteWeight',
				'type': 'uint256',
			},
		],
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
]