import React from 'react'
import { Box, Image, Tooltip, useBreakpointValue } from '@chakra-ui/react'
import defaults from '../common/defaults'
import { prettifyNumber } from '../common/utils'
import { useUSDVprice } from '../hooks/useUSDVprice'

export const USDVpriceIndicator = () => {

	const price = useUSDVprice()

	const maxd = useBreakpointValue({
		base: '2',
		md: '2',
		lg: '5',
	})

	return (
		<>
			{price > 0 &&
				<Tooltip
					hasArrow
					label='USDV exchange rate'
					color='black'
					openDelay={defaults.tooltip.delay}
					placement='bottom'>
					<Box
						fontSize={{ sm: 'sm' }}
						display='inline-flex'
						alignItems='center'
						justifyContent='center'
						borderRadius='12px'
						background='#000'
					>
						<Box
							d='flex'
							alignItems='center'
						>
							<Image
								width='24px'
								height='24px'
								mr='5px'
								src={defaults.usdv.logoURI}
								alt={`${defaults.usdv.name} token`}
							/>
							<Box
								as='h3'
								m='0'
								textTransform='capitalize'>
								<Box as='span' fontSize='1rem'>$</Box>
								{prettifyNumber(price, 0, maxd, 'us')}
							</Box>
						</Box>
					</Box>
				</Tooltip>
			}
		</>
	)
}
