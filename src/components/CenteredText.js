import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from '@chakra-ui/react'

const CenteredText = ({ children, width, casing }) => {
	return (
		<Flex
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
}

export default CenteredText