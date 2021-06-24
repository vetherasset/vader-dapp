import React from 'react'
import useBalanceHooks from '../hooks/useBalance.hooks'
import { getVaderBalance, getVetherBalance, getUSDVBalance } from '../common/ethereum'
import { Box } from '@chakra-ui/react'
import { utils } from 'ethers'

const getBalanceFns = {
	'vader': getVaderBalance,
	'vether': getVetherBalance,
	'usdv': getUSDVBalance,
}

// eslint-disable-next-line
const Balance = React.memo(({ tokenName }) => {
	const tokenBalance = useBalanceHooks(getBalanceFns[tokenName])
	return <Box>
		{utils.formatEther(tokenBalance)}
	</Box>
})

export default Balance