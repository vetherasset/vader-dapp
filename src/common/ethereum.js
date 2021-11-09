import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import humanStandardTokenAbi from '../artifacts/abi/humanStandardToken'
import vaderAbi from '../artifacts/abi/vader'
import converterAbi from '../artifacts/abi/converter'
import poolAbi from '../artifacts/abi/vaderPoolV2'
import routerAbi from '../artifacts/abi/vaderRouter'
import defaults from './defaults'

const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039458'

const approveERC20ToSpend = async (tokenAddress, spenderAddress, amount, provider) => {
	const contract = new ethers.Contract(
		tokenAddress,
		humanStandardTokenAbi,
		provider.getSigner(0),
	)

	const tx = await contract.approve(spenderAddress, amount)
	await tx.wait()
}

const convertVaderToUsdv = async (amount, provider) => {
	const contract = new ethers.Contract(
		defaults.address.vader,
		vaderAbi,
		provider.getSigner(0),
	)
	return await contract.convertToUSDV(amount)
}

const getERC20Allowance = async (tokenAddress, ownerAddress, spenderAddress, provider) => {
	const contract = new ethers.Contract(
		tokenAddress,
		humanStandardTokenAbi,
		provider,
	)
	return await contract.allowance(ownerAddress, spenderAddress)
}

const setERC20Allowance = async (tokenAddress, spenderAddress, wallet) => {
	const provider = new ethers.providers.Web3Provider(wallet.ethereum)
	const contract = new ethers.Contract(
		tokenAddress,
		humanStandardTokenAbi,
		provider.getSigner(0),
	)

	const tx = await contract.approve(spenderAddress, MAX_UINT256)
	await tx.wait()
}

const getERC20BalanceOf = async (tokenAddress, address, provider) => {
	const contract = new ethers.Contract(
		tokenAddress,
		humanStandardTokenAbi,
		provider,
	)
	return await contract.balanceOf(address)
}

const redeemToVADER = async (amountUsdv, provider) => {
	const contract = new ethers.Contract(
		defaults.address.vader,
		vaderAbi,
		provider.getSigner(0),
	)
	return await contract.redeemToVADER(amountUsdv)
}

const resolveUnknownERC20 = async (tokenAddress, provider) => {
	let token
	const contract = new ethers.Contract(
		tokenAddress,
		humanStandardTokenAbi,
		provider,
	)
	const address = await contract.resolvedAddress
	const name = await contract.name().then(r => { return r }).catch(err => console.log(err))
	const symbol = await contract.symbol().then(r => { return r }).catch(err => console.log(err))
	const decimals = await contract.decimals().then(r => { return r.toNumber() }).catch(err => console.log(err))

	if (
		address &&
		name &&
		symbol &&
		decimals &&
		defaults.network.chainId
	) {
		token = {
			'chainId':defaults.network.chainId,
			'address':address,
			'name':name,
			'symbol':symbol,
			'decimals':decimals,
			'logoURI':'',
		}
	}
	return token
}

const estimateGasCost = async (contractAddress, abi, callName, data, provider) => {
	const contract = new ethers.Contract(
		contractAddress,
		abi,
		provider.getSigner(0),
	)
	const execute = (name, context, args) => {
		return context[name](args)
	}
	return await execute(callName, contract.estimateGas, data)
}

const convertVetherToVader = async (amount, provider) => {
	const contract = new ethers.Contract(
		defaults.address.converter,
		converterAbi,
		provider.getSigner(0),
	)
	return await contract.convert(amount)
}

const getSwapEstimate = async (
	from,
	to,
	wallet,
) => {
	const fromNativeAsset = from.address.toLowerCase() == defaults.tokenDefault.address.toLowerCase()
	const toNativeAsset = to.address.toLowerCase() == defaults.tokenDefault.address.toLowerCase()
	const doubleSwap = !fromNativeAsset && !toNativeAsset

	const provider = new ethers.providers.Web3Provider(wallet.ethereum)
	const poolContract = new ethers.Contract(
		defaults.address.pool,
		poolAbi,
		provider.getSigner(0),
	)

	let fromAssetInfo
	let toAssetInfo
	let reserve0 = 0
	if (!fromNativeAsset) {
		fromAssetInfo = await poolContract.pairInfo(from.address)
		reserve0 = fromAssetInfo.reserveForeign.toString()
	}
	if (!toNativeAsset) {
		toAssetInfo = await poolContract.pairInfo(to.address)
		if (fromNativeAsset) {
			reserve0 = toAssetInfo.reserveNative.toString()
		}
	}

	try {
		if (doubleSwap) {
			return BigNumber(
				await poolContract.callStatic.doubleSwap(
					from.address,
					to.address,
					reserve0,
					wallet.account,
				),
			).div(reserve0).times(10 ** from.decimals).div(10 ** to.decimals)
		}
		else {
			const nativeAmount = fromNativeAsset ? reserve0 : 0
			const foreignAmount = toNativeAsset ? reserve0 : 0

			return BigNumber(
				await poolContract.callStatic.swap(
					toNativeAsset ? from.address : to.address,
					nativeAmount,
					foreignAmount,
					wallet.account,
				),
			).div(reserve0).times(10 ** from.decimals).div(10 ** to.decimals)
		}
	}
	catch {
		return BigNumber(0)
	}
}

const swapForAsset = async (
	from,
	to,
	amount,
	wallet,
) => {
	const fromNativeAsset = from.address.toLowerCase() == defaults.tokenDefault.address.toLowerCase()
	const toNativeAsset = to.address.toLowerCase() == defaults.tokenDefault.address.toLowerCase()
	const doubleSwap = !fromNativeAsset && !toNativeAsset
	const amountInWei =	BigNumber(amount).times(10 ** from.decimals).toFixed()

	const provider = new ethers.providers.Web3Provider(wallet.ethereum)
	const routerContract = new ethers.Contract(
		defaults.address.router,
		routerAbi,
		provider.getSigner(0),
	)

	let tx
	if (doubleSwap) {
		tx = await routerContract.swapExactTokensForTokens(
			amountInWei,
			0,
			[
				from.address,
				defaults.tokenDefault.address,
				to.address,
			],
			wallet.account,
			Math.round(Date.now() / 1000 + 600),
		)
	}
	else {
		tx = await routerContract.swapExactTokensForTokens(
			amountInWei,
			0,
			[
				from.address,
				to.address,
			],
			wallet.account,
			Math.round(Date.now() / 1000 + 600),
		)
	}

	await tx.wait()
}

const getSwapRate = async (from, to, provider) => {
	const contract = new ethers.Contract(
		defaults.address.pool,
		provider.getSigner(0),
	)

	return ethers.BigNumber.from(await contract.callStatic.swap(1, from, to))
}

const getSwapFee = async (inputAmount, from, to, provider) => {
	const contract = new ethers.Contract(
		defaults.address.pools,
		provider,
	)

	const baseAmount = ethers.BigNumber.from(await contract.getBaseAmount(to))
	const tokenAmount = ethers.BigNumber.from(await contract.getTokenAmount(to))
	const numerator = tokenAmount.mul(ethers.BigNumber.from(inputAmount).pow(2))
	const denominator = baseAmount.add(1).pow(2)

	return numerator.div(denominator)
}

const getUSDVburnRate = async (provider) => {
	const contract = new ethers.Contract(
		defaults.address.router,
		provider,
	)

	return ethers.BigNumber.from(await contract.getVADERAmount(1))
}

const isAddressLiquidityProvider = async (address, poolAddress, provider) => {
	const contract = new ethers.Contract(
		defaults.address.pools,
		provider,
	)

	return ethers.BigNumber.from(await contract.getMemberUnits(poolAddress, address)).gt(0)
}

const tokenHasPool = async (address, provider) => {
	const contract = new ethers.Contract(
		defaults.address.router,
		provider,
	)

	return await contract.isPool(address)
}

export {
	MAX_UINT256,
	approveERC20ToSpend, getERC20BalanceOf, redeemToVADER, resolveUnknownERC20,
	estimateGasCost, getERC20Allowance, convertVaderToUsdv,
	convertVetherToVader, getSwapEstimate, getSwapRate, getSwapFee,
	getUSDVburnRate, isAddressLiquidityProvider,
	tokenHasPool, swapForAsset, setERC20Allowance,
}