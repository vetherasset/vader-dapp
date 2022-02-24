import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Jazzicon from '@metamask/jazzicon'
import { Flex } from '@chakra-ui/react'

export const TokenJazzicon = (props) => {

	TokenJazzicon.propTypes = {
		address: PropTypes.string,
	}

	const ref = useRef()

	useEffect(() => {
		if (props.address) {
			ref.current.appendChild(Jazzicon(22, parseInt(
				props.address.slice(2, 10), 16)))
		}
		return () => {
			if (props.address) {
				if (ref.current) ref.current.getElementsByTagName('div')[0].remove()
			}
		}
	}, [props.address])

	return (
		<Flex
			width='24px'
			height='24px'
			borderRadius='50%'
			alignItems='center'
			mr='5px'
			ref={ref}
			{...props}
		/>
	)

}
