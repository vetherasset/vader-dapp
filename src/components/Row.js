import React from 'react'
import PropTypes from 'prop-types'

import { Flex } from '@chakra-ui/react'

const Row = ({ children, ...rest }) => {
	return (
		<Flex
			width='100%'
			alignItems='center'
			justifyContent='space-between'
			p={{ base: '12px 24px', md: '0 24px' }}
			minH='60px'
			animation='2.3s ease-in-out infinite bgAnimation'
			transition='all 0.3s ease 0s'
			background='rgba(244, 155, 202, 0.08) none repeat scroll 0% 0%'
			mb='16px'
			borderRadius='16px'
			border='1px solid #ffffff10'
			flexWrap='wrap'
			_hover={{
				background: 'rgba(244, 155, 202, 0.2) none repeat scroll 0% 0%',
				border: '1px solid #ffffff10',
			}}
			{...rest}
		>
			{children}
		</Flex>
	)
}

Row.propTypes = { children: PropTypes.node.isRequired }

export default Row
