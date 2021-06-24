import { ethers } from 'ethers'
import defaults from './defaults'
import vetherTokenAbi from '../abi/Vether.sol/Vether.json'
import vaderTokenAbi from '../abi/Vader.sol/Vader.json'
import USDVTokenAbi from '../abi/USDV.sol/USDV.json'
import humanStandardTokenAbi from '../abi/humanStandardTokenAbi.json'


// get general erc20 token balance
const getERC20BalanceOf = async (tokenAddress, address, provider) => {
	const contract = new ethers.Contract(
		tokenAddress,
		humanStandardTokenAbi.abi,
		provider,
	)
	return await contract.balanceOf(address)
}

const getTokenBalance = async ({ tokenAddress, account, abi, provider }) => {
	console.log(tokenAddress)
	const contract = new ethers.Contract(
		tokenAddress,
		abi,
		provider,
	)
	return await contract.balanceOf(account)
}

const getVetherBalance = async ({ provider, account }) => {
	// return await getERC20BalanceOf(defaults.contract.vether, address, provider)
	return await getTokenBalance({
		tokenAddress: defaults.contract.vether,
		account,
		abi: vetherTokenAbi.abi,
		provider,
	})
}

const getVaderBalance = async ({ provider, account }) => {
	// return await getERC20BalanceOf(defaults.contract.vader)
	return await getTokenBalance({
		tokenAddress: defaults.contract.vader,
		account,
		abi: vaderTokenAbi.abi,
		provider,
	})
}

const getUSDVBalance = async ({ provider, account }) => {
	// return await getERC20BalanceOf(defaults.contract.usdv)
	return await getTokenBalance({
		tokenAddress: defaults.contract.usdv,
		account,
		abi: USDVTokenAbi.abi,
		provider,
	})
}

export {
	getVetherBalance,
	getVaderBalance,
	getUSDVBalance,
}

