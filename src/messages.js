import defaults from './common/defaults'

const approved = {
	title: 'Token succesfully approved',
	description: 'You have approved the token for spending.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const notBurnEligible = {
	title: 'Account not eligible',
	description: 'Your account is not eligible to burn this token.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const featureNotAvailable = {
	title: 'This feature is not available',
	description: 'This option will be implemented in the near future.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const tokenNotAvailableToselect = {
	title: 'This token cannot be selected',
	description: 'This option will be implemented in the near future.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const connected = {
	title: 'Wallet connected',
	description: 'Your wallet has been connected.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const insufficientBalance = {
	title: 'Insufficient balance',
	description: 'Your account balance is insufficient.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const rejected = {
	title: 'Transaction rejected',
	description: 'You have rejected the transaction. Please try again.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const failed = {
	title: 'Transaction failed',
	description: 'Transaction failed. Please try again',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const exception = {
	title: 'Transaction error',
	description: 'This transaction will be reverted. Please try again.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}


const walletNotConnected = {
	title: 'Wallet not connected',
	description: 'Please connect a wallet.',
	status: 'warning',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const vaderconverted = {
	title: 'VADER Token burnt for USDV',
	description: 'Your VADER tokens were successfully burnt for USDV.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const vaderclaimed = {
	title: 'VADER succesfully claimed',
	description: 'Your VADER tokens were successfully claimed.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const dailyLimitReached = {
	title: 'Daily limit reached',
	description: 'The daily limit was reached and cannot be exceeded.',
	status: 'warning',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const usdvredeemed = {
	title: 'USDV burnt for VADER Token',
	description: 'Your USDV tokens were successfully burnt for VADER.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const vethupgraded = {
	title: 'VETH burnt for VADER Token',
	description: 'Your VETH tokens were succesfully burnt for VADER.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const noAmount = {
	title: 'No amount specified',
	description: 'Please specify amount.',
	status: 'warning',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const noToken0 = {
	title: 'No token selected',
	description: 'Please select a token.',
	status: 'warning',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const nothingtoclaim = {
	title: 'Everything already claimed',
	description: 'There\'s no claim left. Everything was already claimed.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const nothingtoUncommit = {
	title: 'No commits to withdraw',
	description: 'You have no commits that can be withdrawn.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const noRewardToWithdraw = {
	title: 'No reward to withdraw',
	description: 'You have no earned reward to be withdrawn.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const noDepositToWithdraw = {
	title: 'No deposit to withdraw',
	description: 'You have no deposit to be withdrawn.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const nomorethaneligible = {
	title: 'Cannot burn more than eligible',
	description: 'Please specify burn amount that is up to eligible amount.',
	status: 'warning',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const notyetUnlocked = {
	title: 'Cannot claim when still locked',
	description: 'You cannot claim before the cooldown is over.',
	status: 'warning',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}


const tokenValueTooSmall = {
	title: 'Token amount is too small',
	description: 'Please input a larger token amount.',
	status: 'warning',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const positionOpened = {
	title: 'Liquidity succesfully provided',
	description: 'You\'ve opened liquidity position.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const staked = {
	title: 'VADER tokens staked',
	description: 'Your VADER tokens have been staked succesfully.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const stakedForRewards = {
	title: 'Depoist has been made',
	description: 'Your tokens have been deposited succesfully.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const bondConcluded = {
	title: 'Bond purchase succesfull',
	description: 'The bond purchase has been concluded.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const commitConcluded = {
	title: 'Bond pre-commit succesfull',
	description: 'The bond pre-commit has been made.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const commitWithdrawn = {
	title: 'Bond un-commit succesfull',
	description: 'The bond commit has been withdrawn.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const noCommitSelected = {
	title: 'No commit selected',
	description: 'Please select a commit to withdraw.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const bondPurchaseValueExceeds = {
	title: 'Purchase exceeds transaction cap',
	description: 'You can\'t purchase more than is transaction cap.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const precommitCapHit = {
	title: 'The maximum number of pre-commits has been hit.',
	description: 'No more pre-commits than is the cap can be made.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const bondSoldOut = {
	title: 'Bond sale has been sold out',
	description: 'This sale has been sold out and cannot be purchased.',
	status: 'warning',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const bondAmountTooSmall = {
	title: 'Amount to buy bond with is too small',
	description: 'Please input a larger amount.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const commitAmountTooSmall = {
	title: 'Amount to commit is too small',
	description: 'Please input a larger amount.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const commitAmounTooLarge = {
	title: 'Amount to commit is too large',
	description: 'Please input a smaller amount.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const unstaked = {
	title: 'xVADER tokens unstaked',
	description: 'Your xVADER tokens have been unstaked succesfully.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const rewardsWithdrawn = {
	title: 'VADER reward tokens withdrawn',
	description: 'Your VADER rewards tokens have been withdrawn succesfully.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const rewardsExited = {
	title: 'All tokens withdrawn',
	description: 'All of your tokens have been withdrawn succesfully.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

export {
	approved, connected, failed, rejected, insufficientBalance,
	walletNotConnected, vaderconverted, vethupgraded, usdvredeemed,
	noAmount, noToken0, tokenValueTooSmall, positionOpened, exception,
	staked, unstaked, vaderclaimed, notBurnEligible, nothingtoclaim,
	nomorethaneligible, featureNotAvailable, tokenNotAvailableToselect,
	bondConcluded, bondPurchaseValueExceeds, bondSoldOut, bondAmountTooSmall,
	notyetUnlocked, dailyLimitReached, precommitCapHit, commitAmountTooSmall,
	commitAmounTooLarge, commitConcluded, commitWithdrawn, noCommitSelected,
	nothingtoUncommit, noRewardToWithdraw, noDepositToWithdraw,
	stakedForRewards, rewardsWithdrawn, rewardsExited,
}