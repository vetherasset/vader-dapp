import defaults from './common/defaults'

// the 🍞 Toaster 🤖 #mhm #tasty
const createToast = ({ title, description, status, ...rest }) => ({
	title,
	description,
	status,

	duration: defaults.toast.duration,
	isClosable: defaults.toast.closable,
	position: defaults.toast.position,

	...rest,
})

const approved = createToast({
	title: 'Token succesfully approved',
	description: 'You have approved the token for spending.',
	status: 'success',
})

const notBurnEligible = createToast({
	title: 'Account not eligible',
	description: 'Your account is not eligible to burn this token.',
	status: 'error',
})

const featureNotAvailable = createToast({
	title: 'This feature is not available',
	description: 'This option will be implemented in the near future.',
	status: 'error',
})

const tokenNotAvailableToselect = createToast({
	title: 'This token cannot be selected',
	description: 'This option will be implemented in the near future.',
	status: 'error',
})

const connected = createToast({
	title: 'Wallet connected',
	description: 'Your wallet has been connected.',
	status: 'success',
})

const insufficientBalance = createToast({
	title: 'Insufficient balance',
	description: 'Your account balance is insufficient.',
	status: 'error',
})

const rejected = createToast({
	title: 'Transaction rejected',
	description: 'You have rejected the transaction. Please try again.',
	status: 'success',
})

const failed = createToast({
	title: 'Transaction failed',
	description: 'Transaction failed. Please try again',
	status: 'error',
})

const exception = createToast({
	title: 'Transaction error',
	description: 'This transaction will be reverted. Please try again.',
	status: 'error',
})


const walletNotConnected = createToast({
	title: 'Wallet not connected',
	description: 'Please connect a wallet.',
	status: 'warning',
})

const vaderconverted = createToast({
	title: 'VADER Token burnt for USDV',
	description: 'Your VADER tokens were successfully burnt for USDV.',
	status: 'success',
})

const vaderclaimed = createToast({
	title: 'VADER succesfully claimed',
	description: 'Your VADER tokens were successfully claimed.',
	status: 'success',
})

const usdvredeemed = createToast({
	title: 'USDV burnt for VADER Token',
	description: 'Your USDV tokens were successfully burnt for VADER.',
	status: 'success',
})

const vethupgraded = createToast({
	title: 'VETH burnt for VADER Token',
	description: 'Your VETH tokens were succesfully burnt for VADER.',
	status: 'success',
})

const noAmount = createToast({
	title: 'No amount specified',
	description: 'Please specify amount.',
	status: 'warning',
})

const noToken0 = createToast({
	title: 'No token selected',
	description: 'Please select a token.',
	status: 'warning',
})

const nothingtoclaim = createToast({
	title: 'Everything already claimed',
	description: 'There\'s no claim left. Everything was already claimed.',
	status: 'success',
})

const nomorethaneligible = createToast({
	title: 'Cannot burn more than eligible',
	description: 'Please specify burn amount that is up to eligible amount.',
	status: 'error',
})

const tokenValueTooSmall = createToast({
	title: 'Token amount is too small',
	description: 'Please input a larger token amount.',
	status: 'warning',
})

const positionOpened = createToast({
	title: 'Liquidity succesfully provided',
	description: 'You\'ve opened liquidity position.',
	status: 'success',
})

const staked = createToast({
	title: 'VADER tokens staked',
	description: 'Your VADER tokens have been staked succesfully.',
	status: 'success',
})

const bondConcluded = createToast({
	title: 'Bond purchase succesfull',
	description: 'The bond purchase has been concluded.',
	status: 'success',
})

const bondPurchaseValueExceeds = createToast({
	title: 'Purchase exceeds transaction cap',
	description: 'Your can\'t purchase more than is transaction cap.',
	status: 'error',
})

const bondSoldOut = createToast({
	title: 'Bond sale has been sold out',
	description: 'This sale has been sold out and cannot be purchased.',
	status: 'warning',
})

const bondAmountTooSmall = createToast({
	title: 'Amount to buy bond with is too small',
	description: 'Please input a larger amount.',
	status: 'error',
})

const unstaked = createToast({
	title: 'xVADER tokens unstaked',
	description: 'Your xVADER tokens have been unstaked succesfully.',
	status: 'success',
})

const copiedContractAddress = createToast({
	title: 'Contract Address',
	description: 'Address copied! Go paste!',
	status: 'success',
})

export {
	approved, connected, failed, rejected, insufficientBalance,
	walletNotConnected, vaderconverted, vethupgraded, usdvredeemed,
	noAmount, noToken0, tokenValueTooSmall, positionOpened, exception,
	staked, unstaked, vaderclaimed, notBurnEligible, nothingtoclaim,
	nomorethaneligible, featureNotAvailable, tokenNotAvailableToselect,
	bondConcluded, bondPurchaseValueExceeds, bondSoldOut, bondAmountTooSmall,
	copiedContractAddress,
}
