import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import humanStandardTokenAbi from '../artifacts/abi/humanStandardToken'
import converterAbi from '../artifacts/abi/converter'
import poolAbi from '../artifacts/abi/vaderPoolV2'
import routerAbi from '../artifacts/abi/vaderRouter'
import defaults from './defaults'
import xVaderAbi from '../artifacts/abi/xvader'

const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039458'

const addLiquidity = async (tokenA, tokenB, amountAdesired, amountBDesired, to, deadline, provider) => {
	const contract = new ethers.Contract(
		defaults.address.router,
		routerAbi,
		provider.getSigner(0),
	)
	// eslint-disable-next-line quotes
	return await contract["addLiquidity(address,address,uint256,uint256,address,uint256)"](tokenA, tokenB, amountAdesired, amountBDesired, to, deadline)
}

const approveERC20ToSpend = async (tokenAddress, spenderAddress, amount, provider) => {
	const contract = new ethers.Contract(
		tokenAddress,
		humanStandardTokenAbi,
		provider.getSigner(0),
	)
	return await contract.approve(spenderAddress, amount)
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
	amount,
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
	let deReserve0 = 0
	if (!fromNativeAsset) {
		fromAssetInfo = await poolContract.pairInfo(from.address)
		deReserve0 = BigNumber(fromAssetInfo.reserveForeign).toString()
		const amountInWei = BigNumber(amount).times(10 ** from.decimals).integerValue()

		if (amountInWei.isLessThan(deReserve0)) {
			deReserve0 = amountInWei.toString()
		}
	}
	if (!toNativeAsset) {
		toAssetInfo = await poolContract.pairInfo(to.address)
		if (fromNativeAsset) {
			deReserve0 = BigNumber(toAssetInfo.reserveNative).toString()
			const amountInWei = BigNumber(amount).times(10 ** to.decimals).integerValue()
			if (amountInWei.isLessThan(deReserve0)) {
				deReserve0 = amountInWei.toString()
			}
		}
	}

	try {
		if (doubleSwap) {
			return BigNumber(
				await poolContract.callStatic.doubleSwap(
					from.address,
					to.address,
					deReserve0,
					wallet.account,
				),
			).div(deReserve0).times(10 ** from.decimals).div(10 ** to.decimals)
		}
		else {
			const nativeAmount = fromNativeAsset ? deReserve0 : 0
			const foreignAmount = toNativeAsset ? deReserve0 : 0

			return BigNumber(
				await poolContract.callStatic.swap(
					toNativeAsset ? from.address : to.address,
					nativeAmount,
					foreignAmount,
					wallet.account,
				),
			).div(deReserve0).times(10 ** from.decimals).div(10 ** to.decimals)
		}
	}
	catch (e) {
		console.log(e)
		return BigNumber(0)
	}
}

const swapForAsset = async (
	from,
	to,
	amount,
	amountOutMin,
	deadline,
	wallet,
) => {
	const fromNativeAsset = from.address.toLowerCase() == defaults.tokenDefault.address.toLowerCase()
	const toNativeAsset = to.address.toLowerCase() == defaults.tokenDefault.address.toLowerCase()
	const doubleSwap = !fromNativeAsset && !toNativeAsset
	const amountInWei =	BigNumber(amount).times(10 ** from.decimals).toFixed()
	const amountOutMinInWei =	BigNumber(amountOutMin).times(10 ** to.decimals).toFixed()
	const deadlineTimeStamp = Math.round(Date.now() / 1000 + deadline * 60)

	const provider = new ethers.providers.Web3Provider(wallet.ethereum)
	const routerContract = new ethers.Contract(
		defaults.address.router,
		routerAbi,
		provider.getSigner(0),
	)

	try {
		let tx
		if (doubleSwap) {
			tx = await routerContract.swapExactTokensForTokens(
				amountInWei,
				amountOutMinInWei,
				[
					from.address,
					defaults.tokenDefault.address,
					to.address,
				],
				wallet.account,
				deadlineTimeStamp,
			)
		}
		else {
			tx = await routerContract.swapExactTokensForTokens(
				amountInWei,
				amountOutMinInWei,
				[
					from.address,
					to.address,
				],
				wallet.account,
				deadlineTimeStamp,
			)
		}

		await tx.wait()
		return true
	}
	catch (e) {
		console.log(e)
		return false
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

const stakeVader = async (amount, provider) => {
	const contract = new ethers.Contract(
		defaults.address.xvader,
		xVaderAbi,
		provider.getSigner(0),
	)
	return await contract.enter(amount)
}

const unstakeVader = async (shares, provider) => {
	const contract = new ethers.Contract(
		defaults.address.xvader,
		xVaderAbi,
		provider.getSigner(0),
	)
	return await contract.leave(shares)
}

export {
	MAX_UINT256,
	approveERC20ToSpend, getERC20BalanceOf, resolveUnknownERC20,
	estimateGasCost, getERC20Allowance,
	convertVetherToVader, getSwapRate, getSwapFee,
	stakeVader, unstakeVader,
	swapForAsset, addLiquidity,
}
