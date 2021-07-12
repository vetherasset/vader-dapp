import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Text } from '@chakra-ui/react'
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons'

const SortableHeader = ({ name }) =>{
	return (
	    <Flex width={name === 'refresh' ? '40%' : '10%'} justifyContent='center'>
			<Text casing='uppercase'>{name}</Text>
			{ name !== 'refresh' && <Flex flexDir='column' ml='10px'>
				<TriangleUpIcon />
				<TriangleDownIcon/>
			</Flex>}
		</Flex>
	)
}

SortableHeader.propTypes = {
	name: PropTypes.string,
}

export default SortableHeader