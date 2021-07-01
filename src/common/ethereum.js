import { ethers } from 'ethers'
import defaults from './defaults'
import vetherTokenAbi from '../abi/Vether.sol/Vether.json'
import vaderTokenAbi from '../abi/Vader.sol/Vader.json'
import USDVTokenAbi from '../abi/USDV.sol/USDV.json'
import VaultAbi from '../abi/Vault.sol/Vault.json'
import { VADER, USDV, VETHER, VAULT } from './consts'


/**
 * get address, abi for a token
 * @param tokenName
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
	case VAULT :
		return {
			abi: VaultAbi.abi,
			address: defaults.contract.vault,
		}
	default:
		return null
	}
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
	let config = null
	let contract = null
	// WIP, this only works for Vader -> USDV now
	switch (name) {
	case VETHER:
	case USDV: {
		config = getTokenConfig(VAULT)
		contract = new ethers.Contract(
			config.address,
			VaultAbi.abi,
			defaults.network.provider.getSigner(0),
		)
		try{
			const share = await getDeposit()
			// no deposit, ask user to deposit fist, lte function converts the value, so just use number here
			if(share.lte(0)) {
				return {
					msg: 'User does not have deposit',
				}
			}
			const dp = amount / share * 100
			return await contract.withdrawToVader(defaults.contract.usdv, dp, { from: defaults.user.account })
		}
		catch (e) {
			console.log(e)
			return {
				msg: 'error when redeem',
			}
		}
	}
	case VADER: {
		 config = getTokenConfig(VADER)
		 contract = new ethers.Contract(
			config.address,
			config. abi,
			defaults.network.provider.getSigner(0),
		)
		return await contract.convertToUSDV(ethers.utils.parseUnits(amount), { from: defaults.user.account })
	}
	}
}

/**
 * get user's deposit balance
 * @returns {Promise<*>}
 */
const getDeposit = async ()=>{
	const { abi, address } = getTokenConfig(VAULT)
	const contract = new ethers.Contract(
		address,
		abi,
		defaults.network.provider.getSigner(0),
	)
	return await contract.getMemberDeposit(defaults.user.account, defaults.contract.usdv)
}


/**
 * deposit token
 * @param token {string} the token name, one of [vader, vether, usdv]
 * @param amount {string} the deposit amount
 * @returns {Promise<*>}
 */
const depositToken = async ({ token, amount })=>{
	const { abi, address } = getTokenConfig(VAULT)
	const tokenConfig = getTokenConfig(token)
	const contract = new ethers.Contract(
		address,
		abi,
		defaults.network.provider.getSigner(0),
	)
	return await contract.deposit(tokenConfig.address, ethers.utils.parseUnits(amount), { from: defaults.user.account })
}

export {
	convertToken,
	getTokenBalance,
	getDeposit,
	depositToken,
}

