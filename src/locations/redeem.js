import React, { useEffect, useState } from 'react'
import {
	Box,
	Flex,
	Text,
	Button,
	NumberInput,
	NumberInputField,
	Image,
	List,
	ListItem,
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import defaults from '../common/defaults'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { getERC20Allowance, getVaderConversionFactor } from '../common/ethereum'
import { useWallet } from 'use-wallet'

export const Redeem = () => {
	const tokens = [
		{
			'chainId':defaults.network.chainId,
			'address': defaults.address.vader,
			'name':'VADER PROTOCOL TOKEN',
			'symbol':'VADER',
			'decimals':18,
			'logoURI':'https://assets.coingecko.com/coins/images/11375/thumb/vether-symbol-coingecko.png?1622341592',
		},
		{
			'chainId':defaults.network.chainId,
			'address':defaults.address.vether,
			'name':'VETHER',
			'symbol':'VETH',
			'decimals':18,
			'logoURI':'https://assets.coingecko.com/coins/images/11375/thumb/vether-symbol-coingecko.png?1622341592',
		},
	]
	const wallet = useWallet()
	const [showTokenList, setShowTokenList] = useState(false)
	const [tokenSelect, setTokenSelect] = useState(tokens[1])
	const [amount] = useState('0')
	const [spendAllowed, setSpendAllowed] = useState(true)
	const [conversionFactor, setConversionFactor] = useState(ethers.BigNumber.from('1000'))

	const HiddenList = {
		visibility: 'hidden',
		opacity: 0,
		display: 'none',
	}

	const ShowList = {
		position: 'absolute',
		transition: 'all 0.5s ease',
		marginTop: '1rem',
		left: 0,
	}

	const ToggleList = {
		visibility: 'visible',
		opacity: 1,
		display: 'block',
	}

	useEffect(() => {
		if (tokenSelect.symbol === 'VETH') {
			getVaderConversionFactor(defaults.network.provider)
				.then((f) => {
					setConversionFactor(f)
				})
				.catch(console.log)
		}
	}, [tokenSelect])

	useEffect(() => {
		if(wallet.account) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			if (tokenSelect.symbol === 'VETH') {
				getERC20Allowance(tokenSelect.address,
					wallet.account,
					defaults.address.vader,
					provider)
					.then(n => {
						if(
							n.gt(ethers.BigNumber.from('0'))
							&& n.gte(ethers.BigNumber.from(String(amount)))
						) setSpendAllowed(true)
					})
					.catch(console.log)
			}
		}
	}, [wallet.account, tokenSelect, amount])

	console.log(spendAllowed)

	return (
		<Box
			maxWidth={defaults.layout.container.sm.width}
			m='0 auto'
			pt='5rem'
		>
			<Flex
				justifyContent='center'
				layerStyle='colorful'
				maxW='49ch'
				m='0 auto'
				p='2.5rem 2.5rem 1.8rem'
				flexDir='column'
			>
				<Text align='center' fontSize='1.55rem' fontWeight='bolder'>
            Asset redemption
				</Text>
				<Text align='center' fontSize='1.12rem' display='block' mb='2rem'>
            Redeem assets by burning your tokens.
				</Text>
				<Text as='h4' fontSize='1.24rem' fontWeight='bolder'>Asset amount to burn</Text>
				<Flex layerStyle='inputLike'>
					<Box flex='1' pr='0.5rem'>
						<NumberInput variant='transparent'>
							<NumberInputField placeholder='0.0' border='none' fontSize='1.5rem' />
						</NumberInput>
					</Box>
					<Box position='relative' cursor='pointer' onClick={() => setShowTokenList(!showTokenList)}>
						<Box d='flex' alignItems='center'>
							<Image
								width='42px'
								mr='10px'
								src={tokenSelect.logoURI}
							/>
							<Box as='h3' m='0' fontSize='xl' fontWeight='bold' textTransform='capitalize'>{tokenSelect.symbol}</Box>
							{!showTokenList ? <TriangleDownIcon ml={1} /> : <TriangleUpIcon ml={1} />}
						</Box>
						<Box {...(showTokenList ? ShowList : HiddenList)} layerStyle='colorful' padding='1rem' mt='.7rem'>
							<List {...ToggleList}>
								{tokens.map(token =>
									<ListItem key={token.name} mb='0.5rem' d='flex' alignItems='center'
										onClick={() => setTokenSelect(token)}
									>
										<Image
											width='42px'
											mr='10px'
											src={token.logoURI}
										/>
										{token.symbol}
									</ListItem>,
								)}
							</List>
						</Box>
					</Box>
				</Flex>
				<Flex mt='2rem' fontSize='1.5rem' fontWeight='bolder'
					justifyContent='center' alignItems='center'>
					{conversionFactor.toString()}
				</Flex>
				<Button
					variant='solidRadial'
					m='2rem auto'
					size='lg'
					minWidth='230px'
					textTransform='uppercase'
				>
						Burn
				</Button>
			</Flex>
		</Box>
	)
}

export default Redeem
