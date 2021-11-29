import { ethers, BigNumber } from 'ethers'
import humanStandardTokenAbi from '../artifacts/abi/humanStandardToken'
import converterAbi from '../artifacts/abi/converter'
import poolAbi from '../artifacts/abi/vaderPoolV2'
import routerAbi from '../artifacts/abi/vaderRouter'
import defaults from './defaults'
import xVaderAbi from '../artifacts/abi/xvader'
import linearVestingAbi from '../artifacts/abi/linearVesting'
import lpStakingAbi from '../artifacts/abi/lpStaking'
import curvePoolAbi from '../artifacts/abi/curvePool'

const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039458'

const toWei = (value, decimals = 0) => {
	let strValue = value.toString()
	const len = strValue.length
	let pointIndex = strValue.indexOf('.')
	pointIndex = pointIndex >= 0 ? pointIndex : len
	strValue = strValue.replace('.', '')
	return BigNumber.from(strValue.padEnd(pointIndex + decimals, '0'))
}

const fromWei = (value, decimals = 0) => {
	const strValue = value.toString()
	const len = strValue.length
	const integer = strValue.substring(0, len - decimals)
	const fractional = strValue.substring(len - decimals, len)
	return Number(integer.padStart(1, '0') + '.' + fractional.padStart(decimals, '0'))
}

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

const convert = async (proof, amount, minVader, provider) => {
	const contract = new ethers.Contract(
		defaults.address.converter,
		converterAbi,
		provider.getSigner(0),
	)
	return await contract.convert(proof, amount, minVader)
}

const getClaimed = async (leaf) => {
	const contract = new ethers.Contract(
		defaults.address.converter,
		converterAbi,
		defaults.network.provider,
	)
	return await contract.claimed(leaf)
}

const getSalt = async () => {
	const contract = new ethers.Contract(
		defaults.address.converter,
		converterAbi,
		defaults.network.provider,
	)
	return await contract.salt()
}

const getClaim = async (account) => {
	const contract = new ethers.Contract(
		defaults.address.linearVesting,
		linearVestingAbi,
		defaults.network.provider,
	)
	return await contract.getClaim(account)
}

const getVester = async (account) => {
	const contract = new ethers.Contract(
		defaults.address.linearVesting,
		linearVestingAbi,
		defaults.network.provider,
	)
	return await contract.vest(account)
}

const claim = async (provider) => {
	const contract = new ethers.Contract(
		defaults.address.linearVesting,
		linearVestingAbi,
		provider.getSigner(0),
	)
	return await contract.claim()
}

const getSwapEstimate = async (
	from,
	to,
	amount,
	wallet,
	isToInput = false,
) => {
	if (Number(amount) == 0) {
		return 0
	}

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
	let deReserve0 = BigNumber.from(0)
	if (!fromNativeAsset) {
		fromAssetInfo = await poolContract.pairInfo(from.address)
		deReserve0 = BigNumber.from(fromAssetInfo.reserveForeign)
		let amountInWei = toWei(amount, from.decimals)
		if (isToInput) {
			amountInWei = toWei(amount, to.decimals)
				.mul(deReserve0)
				.div(fromAssetInfo.reserveNative)
		}
		if (amountInWei.lt(deReserve0)) {
			deReserve0 = amountInWei
		}
	}
	if (!toNativeAsset) {
		toAssetInfo = await poolContract.pairInfo(to.address)
		if (fromNativeAsset) {
			deReserve0 = BigNumber.from(toAssetInfo.reserveNative)
			let amountInWei = toWei(amount, to.decimals)
			if (isToInput) {
				amountInWei = toWei(amount, to.decimals)
					.mul(deReserve0)
					.div(toAssetInfo.reserveForeign)
			}
			if (amountInWei.lt(deReserve0)) {
				deReserve0 = amountInWei
			}
		}
	}

	try {
		if (doubleSwap) {
			return fromWei(
				await poolContract.callStatic.doubleSwap(
					from.address,
					to.address,
					deReserve0.toString(),
					wallet.account,
				), to.decimals,
			) / (isToInput ? fromWei(deReserve0, from.decimals) : amount)
		}
		else {
			const nativeAmount = fromNativeAsset ? deReserve0.toString() : 0
			const foreignAmount = toNativeAsset ? deReserve0.toString() : 0
			return fromWei(
				await poolContract.callStatic.swap(
					toNativeAsset ? from.address : to.address,
					nativeAmount,
					foreignAmount,
					wallet.account,
				), to.decimals,
			) / (isToInput ? fromWei(deReserve0, from.decimals) : amount)
		}
	}
	catch (e) {
		console.log(e)
		return 0
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
	const amountInWei = toWei(amount, from.decimals).toString()
	const amountOutMinInWei =	toWei(amountOutMin, to.decimals).toString()
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

	return BigNumber.from(await contract.callStatic.swap(1, from, to))
}

const getSwapFee = async (inputAmount, from, to, provider) => {
	const contract = new ethers.Contract(
		defaults.address.pools,
		provider,
	)

	const baseAmount = BigNumber.from(await contract.getBaseAmount(to))
	const tokenAmount = BigNumber.from(await contract.getTokenAmount(to))
	const numerator = tokenAmount.mul(BigNumber.from(inputAmount).pow(2))
	const denominator = baseAmount.add(1).pow(2)

	return numerator.div(denominator)
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

const lpTokenStaking = (contractAddress, provider) => {
	const contract = new ethers.Contract(
		contractAddress,
		lpStakingAbi,
		provider ? provider.getSigner(0) : defaults.network.provider,
	)
	const balanceOf = (address) => contract.balanceOf(address)
	const stake = (amount) => contract.stake(amount)
	const withdraw = (amount) => contract.withdraw(amount)
	const earned = (address) => contract.earned(address)
	const claim = () => contract.getReward()
	const rewardRate = () => contract.rewardRate()
	const rewardsDuration = () => contract.rewardsDuration()
	const rewardPerToken = () => contract.rewardPerToken()

	return {
		balanceOf,
		stake,
		withdraw,
		earned,
		claim,
		rewardRate,
		rewardsDuration,
		rewardPerToken,
	}
}

const getLPVirtualPrice = (contractAddress) => {
	const contract = new ethers.Contract(
		contractAddress,
		curvePoolAbi,
		defaults.network.provider,
	)
	return contract.get_virtual_price()
}

export {
	MAX_UINT256,
	approveERC20ToSpend, getERC20BalanceOf, resolveUnknownERC20,
	estimateGasCost, getERC20Allowance,
	convert, getSwapRate, getSwapFee,
	stakeVader, unstakeVader,
	swapForAsset, addLiquidity,
	getSalt, getClaimed, getClaim, getVester,
	claim,
	getSwapEstimate,
	lpTokenStaking, getLPVirtualPrice,
}
