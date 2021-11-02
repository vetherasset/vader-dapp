import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import defaults from '../common/defaults'

const Pool = (props) => {

	return (
		<Box
			height={`calc(100vh - ${defaults.layout.header.minHeight})`}
			maxWidth={defaults.layout.container.md.width}
			m='0 auto'
			p={{ base: '5rem 1.2rem 0', md: '5rem 0 0' }}
			{...props}
		>
			<Flex
				m='0 auto'
				p='1.8rem'
				flexDir='row'
				height='auto'
				justifyContent='space-between'
			>
				<Text
					as='h4'
					fontSize='1.24rem'
					fontWeight='bolder'>
						Liquidity
				</Text>
				<Link to='/pool/deposit'>
					<Button
						variant='outlineAlter'
						size='sm'
						padding='0'
						alignItems='center'
						backgroundSize='150%'
					>
						<Box
							display='inline-flex'
							alignItems='center'
							justifyContent='center'
							borderRadius='12px'
							background='#000'
							height='100%'
							p='0 1rem'
						>
							<span>Deposit</span>
						</Box>
					</Button>
				</Link>
			</Flex>
			<Flex
				m='0 auto'
				p='1px'
				flexDir='column'
				height='auto'
				layerStyle='colorful'
				backgroundImage='linear-gradient(90deg,rgb(100, 71, 101) 0%,rgb(33, 74, 112) 100%)'
			>
				<Flex
					width='100%'
					layerStyle='colorful'
					background='#000000c4;'
					minH='401.367px'
					p='2.7rem'
					flexDir='column'
					justifyContent='center'
				>
					<Flex
						p='0 0.3rem'
						flexDir='column'
						justifyContent='center'
						textAlign='center'
						alignItems='center'
					>
						<Text fontSize='1.1rem' color='#adadb0'>You&lsquo;re currently providing no liquidity.</Text>
						<Link to='/pool/deposit'>
							<Text fontSize='1.1rem' color='#3384ca' fontStyle='italic' cursor='pointer'>Go ahead, add some!</Text>
						</Link>
					</Flex>
				</Flex>
			</Flex>
		</Box>
	)
}

export default Pool
