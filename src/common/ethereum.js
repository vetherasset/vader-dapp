import { ethers } from 'ethers'
import defaults from './defaults'
import vetherTokenAbi from '../abi/Vether.sol/Vether.json'


const getVetherBalance = async (provider, address) => {
	const contract = new ethers.Contract(
		defaults.contract.vether,
		vetherTokenAbi.abi,
		provider,
	)
	console.log(contract)
	return await contract.balanceOf(address)
}
export default getVetherBalance