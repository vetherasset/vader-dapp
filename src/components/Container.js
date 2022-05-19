import React from 'react'
import PropTypes from 'prop-types'

import { Flex } from '@chakra-ui/react'

const Container = ({ children, inverted = false, ...rest }) => {
	return !inverted ? (
		<Flex
			w='100%'
			minH={{ base: 'auto', md: '478.65px' }}
			maxW='50ch'
			margin='0 auto'
			padding={{ base: '2rem 0.9rem', md: '2rem 2.6rem' }}
			layerStyle='colorful'
			flexDir='column'
			{...rest}
		>
			{children}
		</Flex>
	) : (
		<Flex
			maxW='50ch'
			m='0 auto'
			p='1px'
			flexDir='column'
			height='auto'
			layerStyle='colorful'
			backgroundImage='linear-gradient(90deg,rgb(100, 71, 101) 0%,rgb(33, 74, 112) 100%)'
		>
			<Flex
				position='relative'
				width='100%'
				minH='430.4px'
				padding={{ base: '2rem 0.9rem', md: '2rem 2.6rem' }}
				flexDir='column'
				justifyContent='center'
				layerStyle='colorful'
				background='#000000c4;'
				{...rest}
			>
				{children}
			</Flex>
		</Flex>
	)
}

Container.propTypes = {
	children: PropTypes.node.isRequired,
	inverted: PropTypes.bool,
}

export default Container
