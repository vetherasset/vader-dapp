import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Flex, Text } from '@chakra-ui/react'
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons'

const SortableHeader = ({ name, text, index,
	sortHandler }) =>{
	const ascColor = '#ff9ddb'
	const descColor = '#26a4fe'
	const [order, setOrder] = useState('asc')
	const display = [
	    { base: 'flex' },
		{ base: 'none', md: 'flex' },
		{ base: 'none', md: 'flex' },
		{ base: 'none', md: 'flex' },
		{ base: 'none', md: 'flex' },
		{ base: 'none', lg: 'flex' },
		{ base: 'none', lg: 'flex' },
	]

	return (
	    <Flex
			display={display[index]}
			width={name === 'refresh' ? '40%' : '10%'}
			  justifyContent='center'
			  cursor='pointer'
			  onClick={()=>{
			  	const newOrder = order === 'asc' ? 'desc' : 'asc'
				  setOrder(newOrder)
			    sortHandler(newOrder)
			  }
			}>
			<Text casing='uppercase'>{text}</Text>
			{ name !== 'refresh' && <Flex flexDir='column' ml='10px'>
				<TriangleUpIcon color={order === 'asc' ? ascColor : descColor} />
				<TriangleDownIcon color={order !== 'asc' ? ascColor : descColor} />
			</Flex>}
		</Flex>
	)
}

SortableHeader.propTypes = {
	name: PropTypes.string,
	text: PropTypes.string,
	sortHandler: PropTypes.func,
	index: PropTypes.number,
}

export default SortableHeader