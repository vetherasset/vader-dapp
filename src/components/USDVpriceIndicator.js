import React from 'react'
import { Box, Image, Tooltip } from '@chakra-ui/react'
import defaults from '../common/defaults'
import { prettifyNumber } from '../common/utils'
import { useUSDVprice } from '../hooks/useUSDVprice'

export const USDVpriceIndicator = () => {

	const price = useUSDVprice()

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
						fontSize={{ base: '0.65rem', sm: 'sm' }}
						display='inline-flex'
						alignItems='center'
						justifyContent='center'
						borderRadius='12px'
						background='#000'
						p='7px 10px'
						gridGap='13px'
						transform={{
							base: 'scale(0.86)',
							sm: 'scale(1)',
						}}
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
								{prettifyNumber(price, 0, 5, 'us')}
							</Box>
						</Box>
					</Box>
				</Tooltip>
			}
		</>
	)
}
