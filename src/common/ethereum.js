import { ethers, BigNumber } from 'ethers'
import humanStandardTokenAbi from '../artifacts/abi/humanStandardToken'
import converterAbi from '../artifacts/abi/converter'
import routerAbi from '../artifacts/abi/vaderRouter'
import defaults from './defaults'
import xVaderAbi from '../artifacts/abi/xvader'
import linearVestingAbi from '../artifacts/abi/linearVesting'

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

const swapForAsset = async (amount, from, to, provider) => {
	const contract = new ethers.Contract(
		defaults.address.router,
		provider.getSigner(0),
	)

	return ethers.BigNumber.from(await contract.swap(amount, from, to))
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
	approveERC20ToSpend, getERC20BalanceOf, resolveUnknownERC20,
	estimateGasCost, getERC20Allowance,
	convert, getSwapRate, getSwapFee,
	stakeVader, unstakeVader,
	swapForAsset, addLiquidity,
	getSalt, getClaimed, getClaim, getVester,
	claim,
}
