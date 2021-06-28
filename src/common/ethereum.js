import { ethers } from 'ethers'
import defaults from './defaults'
import vetherTokenAbi from '../abi/Vether.sol/Vether.json'
import vaderTokenAbi from '../abi/Vader.sol/Vader.json'
import USDVTokenAbi from '../abi/USDV.sol/USDV.json'
import humanStandardTokenAbi from '../abi/humanStandardTokenAbi.json'
import { VADER, USDV, VETHER } from './consts'


/**
 * get address, abi for a token
 * @param tokenName
 *
 * @returns config {Object: {abi: tokenAbi, address: token address}}
 */
const getTokenConfig = (tokenName) => {
	switch (tokenName) {
	case VADER:
		return {
			abi: vaderTokenAbi.abi,
			address: defaults.contract.vader,
		}
	case VETHER:
		return {
			abi: vetherTokenAbi.abi,
			address: defaults.contract.vether,
		}
	case USDV:
		return {
			abi: USDVTokenAbi.abi,
			address: defaults.contract.usdv,
		}
	default:
		return null
	}
}

// get general erc20 token balance
const getERC20BalanceOf = async (tokenAddress, address, provider) => {
	const contract = new ethers.Contract(
		tokenAddress,
		humanStandardTokenAbi.abi,
		provider,
	)
	return await contract.balanceOf(address)
}

const getTokenBalance = async (tokenName) => {
	const { abi, address } = getTokenConfig(tokenName)
	const contract = new ethers.Contract(
		address,
		abi,
		defaults.network.provider,
	)
	return await contract.balanceOf(defaults.user.account)
}


/**
 * @param tokenName {string} the token name to convert from
 * @param amount {string} the amount user input, will be converted to BigNumber.
 * @return {Promise<*>}
 */
const convertToken = async ({ name, amount }) => {
	if (!defaults.user.account) {
		return null
	}
	const { abi, address } = getTokenConfig(VADER)
	const contract = new ethers.Contract(
		address,
		abi,
		defaults.network.provider.getSigner(0),
	)
	// WIP, this only works for Vader -> USDV now
	switch (name) {
	case VETHER:
		break
	case USDV:
		return await contract.withdrawToVader(ethers.utils.parseUnits(amount), { from: defaults.user.account })
	case VADER:
		return await contract.convertToUSDV(ethers.utils.parseUnits(amount), { from: defaults.user.account })
	}

}


export {
	convertToken,
	getTokenBalance,
}

