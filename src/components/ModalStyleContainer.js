import React from 'react'
import { Box, Flex } from '@chakra-ui/react'
import defaults from '../common/defaults'
import PropTypes from 'prop-types'


const ModalStyleContainer = ({ children, ...props })=>{
	console.log(props)
	return(
		<Box
			maxWidth={defaults.layout.container.sm.width}
			m='0 auto'
			pt='5rem'
			{	...props}
		>
			<Flex
				justifyContent='center'
				layerStyle='colorful'
				maxW='49ch'
				m='0 auto'
				p='1.8rem'
			>
				{children}
			</Flex>
		</Box>
	)
}

ModalStyleContainer.propTypes = {
	children: PropTypes.node.isRequired,
}

export default ModalStyleContainer
