import { ethers } from 'ethers'
import humanStandardTokenAbi from '../artifacts/humanStandardTokenAbi'
import vaderAbi from '../artifacts/VaderAbi'
import routerAbi from '../artifacts/RouterAbi'
import poolsAbi from '../artifacts/PoolsAbi'
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

const getVaderConversionFactor = async (provider) => {
	const contract = new ethers.Contract(
		defaults.address.vader,
		vaderAbi,
		provider,
	)
	return await contract.conversionFactor()
}

const getVaderAmount = async (amountUsdv, provider) => {
	const contract = new ethers.Contract(
		defaults.address.router,
		routerAbi,
		provider,
	)
	return await contract.getVADERAmount(amountUsdv)
}

const getUsdvAmount = async (amountVader, provider) => {
	const contract = new ethers.Contract(
		defaults.address.router,
		routerAbi,
		provider,
	)
	return await contract.getUSDVAmount(amountVader)
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

const upgradeVetherToVader = async (amount, provider) => {
	const contract = new ethers.Contract(
		defaults.address.vader,
		vaderAbi,
		provider.getSigner(0),
	)
	return await contract.upgrade(amount)
}

const getSwapRate = async (from, to, provider) => {
	const contract = new ethers.Contract(
		defaults.address.router,
		routerAbi,
		provider.getSigner(0),
	)

	return ethers.BigNumber.from(await contract.callStatic.swap(1, from, to))
}

const getSwapFee = async (inputAmount, from, to, provider) => {
	const contract = new ethers.Contract(
		defaults.address.pools,
		poolsAbi,
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
		routerAbi,
		provider,
	)

	return ethers.BigNumber.from(await contract.getVADERAmount(1))
}

const isAddressLiquidityProvider = async (address, poolAddress, provider) => {
	const contract = new ethers.Contract(
		defaults.address.pools,
		poolsAbi,
		provider,
	)

	return ethers.BigNumber.from(await contract.getMemberUnits(poolAddress, address)).gt(0)
}

const tokenHasPool = async (address, provider) => {
	const contract = new ethers.Contract(
		defaults.address.pools,
		poolsAbi,
		provider,
	)

	return ethers.BigNumber.from(await contract.getUnits(address)).gt(0)
}

export {
	approveERC20ToSpend, getERC20BalanceOf, redeemToVADER, resolveUnknownERC20,
	estimateGasCost, getVaderConversionFactor, getERC20Allowance, convertVaderToUsdv,
	upgradeVetherToVader, getSwapRate, getSwapFee, getUSDVburnRate, isAddressLiquidityProvider,
	getVaderAmount, getUsdvAmount, tokenHasPool,
}