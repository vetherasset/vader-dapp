import React from 'react'
import { Box, Flex } from '@chakra-ui/react'
import defaults from '../common/defaults'

const PoolDetail = (props) => {

	return (
		<Box
			height={`calc(100vh - ${defaults.layout.header.minHeight})`}
			maxWidth={defaults.layout.container.lg.width}
			m='0 auto'
			pt='5rem'
			{...props}
		>
			<Flex
				minH='478.65px'
				m='0 auto'
				p='1.8rem'
				flexDir='column'
			>
				<Box
					w='100%'
					maxWidth='49ch'
					m='0 auto'
				>
					<Box as='h3' fontSize='1.3rem' fontWeight='bold' textTransform='capitalize'>Pool</Box>
				</Box>
				<Box
					mb='5rem'
					p='1.8rem'
				>
				</Box>
			</Flex>
		</Box>
	)
}

export default PoolDetail
