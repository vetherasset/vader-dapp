import { ethers } from 'ethers'
import humanStandardTokenAbi from '../artifacts/abi/humanStandardToken'
import vaderAbi from '../artifacts/abi/vader'
import converterAbi from '../artifacts/abi/converter'
import poolAbi from '../artifacts/abi/vaderPoolV2'
import defaults from './defaults'

const approveERC20ToSpend = async (tokenAddress, spenderAddress, amount, provider) => {
	const contract = new ethers.Contract(
		tokenAddress,
		humanStandardTokenAbi,
		provider.getSigner(0),
	)
	return await contract.approve(spenderAddress, amount)
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
	token0,
	token1,
	amount0,
	amount1,
	wallet,
) => {
	const fromNativeAsset = token0.address.toLowerCase() == defaults.tokenDefault.address.toLowerCase()
	const toNativeAsset = token1.address.toLowerCase() == defaults.tokenDefault.address.toLowerCase()
	const doubleSwap = !fromNativeAsset && !toNativeAsset

	const provider = new ethers.providers.Web3Provider(wallet.ethereum)
	const contract = new ethers.Contract(
		defaults.address.pool,
		poolAbi,
		provider.getSigner(0),
	)
	try {
		if (doubleSwap) {
			return ethers.BigNumber.from(
				await contract.callStatic.doubleSwap(
					token0.address,
					token1.address,
					amount1 == 0 ? amount0 : amount1,
					wallet.account,
				),
			)
		}
		else {
			const nativeAmount = fromNativeAsset && amount1 == 0
				? amount0
				: (toNativeAsset && amount0 == 0 ? amount1 : 0)
			const foreignAmount = !fromNativeAsset && amount1 == 0
				? amount0
				: (!toNativeAsset && amount0 == 0 ? amount1 : 0)
			return ethers.BigNumber.from(
				await contract.callStatic.swap(
					toNativeAsset ? token0.address : token1.address,
					nativeAmount,
					foreignAmount,
					wallet.account,
				),
			)
		}
	}
	catch {
		return ethers.BigNumber.from(0)
	}
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

const swapForAsset = async (amount, from, to, provider) => {
	const contract = new ethers.Contract(
		defaults.address.router,
		provider.getSigner(0),
	)

	return ethers.BigNumber.from(await contract.swap(amount, from, to))
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
	approveERC20ToSpend, getERC20BalanceOf, redeemToVADER, resolveUnknownERC20,
	estimateGasCost, getERC20Allowance, convertVaderToUsdv,
	convertVetherToVader, getSwapEstimate, getSwapRate, getSwapFee,
	getUSDVburnRate, isAddressLiquidityProvider,
	tokenHasPool, swapForAsset,
}