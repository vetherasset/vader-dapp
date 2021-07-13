import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from '@chakra-ui/react'

const CenteredText = ({ children, width, casing, display }) => {
	console.log('rendered')
	return (
		<Flex
			display={display}
			width={width}
			justifyContent='center' alignContent="center" alignItems="center" textTransform={casing}>
			{children}
		</Flex>
	)
}

CenteredText.propTypes = {
	children: PropTypes.node,
	width: PropTypes.string,
	casing: PropTypes.string,
	display: PropTypes.object,
}

export default CenteredText