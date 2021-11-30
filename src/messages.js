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
	title: 'This feature\'s not yet available',
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
	description: 'Your wallet account has been connected.',
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
	description: 'You have rejected the transaction.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const failed = {
	title: 'Transaction failed',
	description: 'Something happened. Proccessing failed.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const exception = {
	title: 'Something is wrong',
	description: 'Such transaction would be reverted.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}


const walletNotConnected = {
	title: 'Wallet not connected',
	description: 'Please connect a wallet.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const vaderconverted = {
	title: 'Vader Token burnt for USDV',
	description: 'Your tokens were burnt succesfully.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const vaderclaimed = {
	title: 'Vader succesfully claimed',
	description: 'Your tokens have been claimed.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const usdvredeemed = {
	title: 'USDV burnt for Vader Token',
	description: 'Your tokens were burnt succesfully.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const vethupgraded = {
	title: 'Veth burnt for Vader Token',
	description: 'Your tokens were burnt succesfully.',
	status: 'success',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const noAmount = {
	title: 'No amount specified',
	description: 'You didn\'t specify amount.',
	status: 'warning',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const noToken0 = {
	title: 'No token selected',
	description: 'You didn\'t select a token.',
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

const nomorethaneligible = {
	title: 'Can not burn more than eligible',
	description: 'You can\'t burn more than you\'re eligible.',
	status: 'error',
	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,
}

const tokenValueTooSmall = {
	title: 'Token amount is too small',
	description: 'The amount you specified is too small.',
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

const unstaked = {
	title: 'xVADER tokens unstaked',
	description: 'Your xVADER tokens have been unstaked succesfully.',
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
}
