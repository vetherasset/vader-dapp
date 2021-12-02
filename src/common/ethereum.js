import { ethers } from 'ethers'
import humanStandardTokenAbi from '../artifacts/abi/humanStandardToken'
import converterAbi from '../artifacts/abi/converter'
import defaults from './defaults'
import xVaderAbi from '../artifacts/abi/xvader'
import linearVestingAbi from '../artifacts/abi/linearVesting'

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
	convert,
	stakeVader, unstakeVader,
	getSalt, getClaimed, getClaim, getVester,
	claim,
}
