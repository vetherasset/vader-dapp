import React from 'react'
import { Flex, Spacer } from '@chakra-ui/react'

import { Logotype } from './Logotype'
import { ColorModeSwitcher } from './ColorModeSwitcher'

export const Header = (props) => {

	return (
		<Flex {...props}>
			<Flex w="33%">
				<Logotype h='60px'
					transform='scale(0.9)' />
			</Flex>
			<Spacer />
			<Flex w="33%"
				justifyContent='flex-end'
			>
				<ColorModeSwitcher marginLeft='0.6rem' />
			</Flex>
		</Flex>
	)
}
