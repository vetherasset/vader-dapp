import React from 'react'
import { Flex, Link, Image } from '@chakra-ui/react'
import { FaDiscord, FaTelegramPlane, FaGithub } from 'react-icons/fa'
import { IoIosPaper } from 'react-icons/io'
import { MdHelp } from 'react-icons/md'
import UniswapIcon from '../assets/svg/uniswap.svg'

export const Footer = (props) => {

	const linkStyle = {
		margin: '10px auto',
	}

	const iconStyle = {
		display: 'inline-block',
		marginInlineEnd: '0.5rem',
		fontSize: '0.83rem',
		verticalAlign: 'baseline',
	}

	return(
		<Flex {...props}>
			<Link {...linkStyle} isExternal href='https://vaderprotocol.io/whitepaper'>
				<IoIosPaper style={iconStyle}/>
				Whitepaper
			</Link>
			<Link {...linkStyle} isExternal>
				<Image src={UniswapIcon} display='inline-block' marginInlineEnd='0.5rem' width='14.4px' verticalAlign='baseline' />
				Uniswap
			</Link>
			<Link {...linkStyle} isExternal href='https://docs.vaderprotocol.io/'>
				<MdHelp style={iconStyle}/>
				Docs
			</Link>
			<Link {...linkStyle} isExternal href='https://discord.com/invite/vaderprotocol'>
				<FaDiscord style={iconStyle}/>
				Discord
			</Link>
			<Link {...linkStyle} isExternal href='https://t.me/vaderprotocol'>
				<FaTelegramPlane style={iconStyle}/>
				Telegram
			</Link>
			<Link {...linkStyle} isExternal href='https://github.com/vetherasset/'>
				<FaGithub style={iconStyle}/>
				Github
			</Link>
		</Flex>
	)
}