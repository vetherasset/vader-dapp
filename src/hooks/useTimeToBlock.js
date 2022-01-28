import { utils } from 'ethers'
import { useEffect, useState } from 'react'
import defaults from '../common/defaults'
import { getDateFromSeconds } from '../common/utils'

export const useTimeToBlock = (blockTarget) => {

	const [block, setBlock] = useState(undefined)
	const [eta, setEta] = useState('0')

	useEffect(() => {
		const interval = setInterval(() => {
			defaults.network.provider.getBlockNumber()
				.then(n => {
					setBlock(n)
				})
		}, defaults.network.pollInterval)
		defaults.network.provider.getBlockNumber()
			.then(n => setBlock(n))
		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		if(block && blockTarget) {
			const target = utils.parseUnits(String(blockTarget), 18)
			const blocks = target.sub(utils.parseUnits(String(block)), 18)
			const seconds = blocks.div(utils.parseUnits(String(defaults.network.blockTime.second), 18))
			const date = getDateFromSeconds(seconds.toNumber())
			setEta(date)
		}
	}, [block, blockTarget])

	return [eta, setBlock]

}