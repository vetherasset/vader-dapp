import React from 'react'
import useBalanceHooks from '../hooks/useBalance.hooks'
import { Box } from '@chakra-ui/react'
import { utils } from 'ethers'


// eslint-disable-next-line
const Balance = React.memo(({ tokenName, setBurnTokenTotalValue }) => {
	const tokenBalance = useBalanceHooks(tokenName)
	setBurnTokenTotalValue(tokenBalance)
	return(
		tokenName &&	<Box>
			{utils.formatEther(tokenBalance)}
		</Box>)

})

export default Balance