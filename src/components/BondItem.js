import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Flex, Image, Tag } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { prettifyCurrency } from '../common/utils'

export const BondItem = (props) => {

	BondItem.propTypes = {
		protocol: PropTypes.object.isRequired,
		payout: PropTypes.object.isRequired,
		token0: PropTypes.object.isRequired,
		token1: PropTypes.object.isRequired,
		isBonded: PropTypes.bool.isRequired,
	}

	return (
		<Link to={`/bond/${props.protocol.address}`}>
			<Flex
				width='100%'
				alignItems='center'
				justifyContent='space-between'
				p='0 24px'
				minH='60px'
				cursor='pointer'
				animation={ props.isBonded ? '2.3s ease-in-out infinite bgAnimation' : '' }
				transition='all 0.3s ease 0s'
				background='rgba(244, 155, 202, 0.08) none repeat scroll 0% 0%'
				mb='16px'
				borderRadius='16px'
				border={ props.isBonded ? '1px solid #ffffff10' : '1px solid #ffffff08' }
				_hover={{
					cursor: 'pointer',
					background: 'rgba(244, 155, 202, 0.2) none repeat scroll 0% 0%',
					border: '1px solid #ffffff10',
				}}
			>
				<Flex
					fontWeight='bolder'>
					<Image
						width='23px'
						height='23px'
						borderRadius='50%'
						objectFit='none'
						background='#fff'
						mr='10px'
						src={props.token0.logoURI}
					/>
					<Image
						width='23px'
						height='23px'
						borderRadius='50%'
						objectFit='none'
						background='#fff'
						mr='10px'
						src={props.token1.logoURI}
					/>
					{props.token0.symbol}/{props.token1.symbol}
					{props.isBonded &&
						<Tag
							ml='10px'
							colorScheme='green'>
							<CheckCircleIcon
								mr='5px'
							/> BONDED
						</Tag>
					}
				</Flex>
				<Flex
					flexDir='row'
					alignContent='flex-end'
					justifyContent='flex-end'
					gridGap='0.7rem'
				>
					<Tag colorScheme='blue'>
						{props.protocol.name}
					</Tag>
					<Tag colorScheme='blue'>
						{props.payout.symbol}
					</Tag>
					<Tag colorScheme='blue'>
						100%
					</Tag>
					<Tag colorScheme='blue'>
						{prettifyCurrency(999999999, 0, 4)}
					</Tag>
				</Flex>
			</Flex>
		</Link>
	)
}