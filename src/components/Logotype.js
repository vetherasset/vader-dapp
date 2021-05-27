import React from 'react'
import { useColorModeValue, Image } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import logo from '../assets/svg/logotype.svg'
import logoInverted from '../assets/svg/logotype-inverted.svg'

export const Logotype = (props) => {

	const svg = useColorModeValue(logoInverted, logo)

	return (
		<Link to='/'>
			<Image src={svg}
				{...props}
			/>
		</Link>
	)
}
