import React, { useEffect, useRef, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Box, Flex, NumberInput, NumberInputField, Input, Button, Image, useDisclosure,
	Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
} from '@chakra-ui/react'
import { FixedSizeList as List } from 'react-window'
import { TriangleDownIcon } from '@chakra-ui/icons'
import defaults from '../common/defaults'
import { useWallet } from 'use-wallet'
import { ethers } from 'ethers'
import { getERC20BalanceOf, resolveUnknownERC20 } from '../common/ethereum'
import { isEthereumAddress, searchFor } from '../common/utils'
import getTokenList from 'get-token-list'

const flex = {
	flex: '1',
}

const input = {
	variant: 'transparent',
}

const field = {
	fontSize: '1.8rem',
	fontWeight: 'bold',
}

const span = {
	fontSize: '0.7rem',
	opacity: '0.9',
}

const TokenSelectButton = ({ data, index, style }) => {
	TokenSelectButton.propTypes = {
		index: PropTypes.number.isRequired,
		style: PropTypes.object.isRequired,
		data: PropTypes.any.isRequired,
	}
	return (
		<Button
			variant='ghostSelectable'
			fontWeight='600'
			fontSize='1.2rem'
			justifyContent='left'
			p='2rem 1.5rem'
			onClick={() => {
				if (data.tokenList) {
					if (data.isSelect === 0) data.setToken0(data.tokenList[index])
					if (data.isSelect === 1) data.setToken1(data.tokenList[index])
				}
				data.onClose()
			}}
			style={style}
			key={index}>
			{data.tokenList &&
				<>
					<Image
						width='42px'
						mr='10px'
						src={data.tokenList[index].logoURI}
					/>
					{data.tokenList[index].name}
				</>
			}
		</Button>
	)
}

export const Swap = () => {

	const { isOpen, onOpen, onClose } = useDisclosure()
	const initialRef = useRef()

	const wallet = useWallet()

	const [isSelect, setIsSelect] = useState(-1)
	const [tokenListDefault, setTokenListDefault] = useState(false)
	const tokenList = useMemo(() => tokenListDefault.tokens, [tokenListDefault])
	const [tokenListModified, setTokenListModified] = useState(false)
	const [token0, setToken0] = useState(defaults.tokenDefault)
	const [token1, setToken1] = useState(false)
	const [balance0, setBalance0] = useState(false)
	const [balance1, setBalance1] = useState(false)

	useEffect(() => {
		getTokenList(defaults.tokenList)
			.then(data => {
				setTokenListDefault(data)
			})
			.catch(err => {
				setTokenListDefault(false)
				console.log(err)
			})
	}, [])

	useEffect(() => {
		if (!isOpen) setIsSelect(-1)
	}, [isOpen])

	useEffect(() => {
		if (wallet.account && token0) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getERC20BalanceOf(token0.address, wallet.account, provider)
				.then(b => {
					setBalance0(b)
				})
				.catch(err => {
					setBalance0(false)
					console.log(err)
				})
		}
	}, [wallet.account, token0])

	useEffect(() => {
		if (wallet.account && token1) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getERC20BalanceOf(token1.address, wallet.account, provider)
				.then(b => {
					setBalance1(b)
				})
				.catch(err => {
					setBalance1(false)
					console.log(err)
				})
		}
	}, [wallet.account, token1])

	return (
		<>
			<Box
				height={`calc(100vh - ${defaults.layout.header.minHeight})`}
				maxWidth={defaults.layout.container.sm.width}
				m='0 auto'
				pt='5rem'
			>
				<Flex
					maxW='49ch'
					m='0 auto'
					p='1.8rem'
					layerStyle='colorful'
					flexDir='column'
				>
					<Flex
						{...flex}
						mb='1.1rem'
						p='0 0.3rem'
						flexDir='row'
						justifyContent='space-between'
					>
						<Box as='h3' m='0' fontSize='xl' fontWeight='bold' textTransform='capitalize'>Swap</Box>
						<Box
							as='button'
							width='22px'
						>
							<Image m='0' height='22px' src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27.42047 27.42047'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23fff;%7D%3C/style%3E%3C/defs%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cpath class='cls-1' d='M14.57066,27.42047h-1.7209a2.52716,2.52716,0,0,1-2.52429-2.52424V24.314a11.07024,11.07024,0,0,1-1.719-.71352l-.41259.41259a2.52427,2.52427,0,0,1-3.57028-.00038L3.40731,22.79648a2.52414,2.52414,0,0,1,.00033-3.57029l.41227-.41227a11.07,11.07,0,0,1-.71352-1.719H2.52424A2.52714,2.52714,0,0,1,0,14.57071v-1.721a2.52716,2.52716,0,0,1,2.52429-2.52424h.58215A11.0716,11.0716,0,0,1,3.82,8.60655L3.40737,8.194a2.52429,2.52429,0,0,1,.00032-3.57029L4.6241,3.40737a2.524,2.524,0,0,1,3.57023.00032l.41222.41222a11.0785,11.0785,0,0,1,1.719-.71352V2.52424A2.52712,2.52712,0,0,1,12.84981,0h1.7209A2.52711,2.52711,0,0,1,17.095,2.52424v.5822a11.06956,11.06956,0,0,1,1.719.71352l.41259-.41259a2.52428,2.52428,0,0,1,3.57029.00037L24.0131,4.624a2.52414,2.52414,0,0,1-.00032,3.57028l-.41227.41228a11.07152,11.07152,0,0,1,.71352,1.719h.58215a2.52716,2.52716,0,0,1,2.52429,2.52424v1.721A2.52716,2.52716,0,0,1,24.89618,17.095H24.314a11.074,11.074,0,0,1-.71352,1.719l.41259.41259a2.52429,2.52429,0,0,1-.00032,3.57029l-1.21641,1.21635a2.524,2.524,0,0,1-3.57023-.00032l-.41222-.41222a11.07931,11.07931,0,0,1-1.719.71352v.58221A2.5271,2.5271,0,0,1,14.57066,27.42047ZM8.87507,21.91334a9.46917,9.46917,0,0,0,2.45451,1.0189.80328.80328,0,0,1,.60261.77784v1.18615a.91866.91866,0,0,0,.91762.91757h1.7209a.91866.91866,0,0,0,.91762-.91757V23.71008a.80327.80327,0,0,1,.60261-.77784,9.46917,9.46917,0,0,0,2.45451-1.0189.8033.8033,0,0,1,.977.12345l.84018.84023A.91727.91727,0,0,0,21.66,22.8774l1.21716-1.21711a.91741.91741,0,0,0,.00032-1.29738l-.84055-.84056a.80336.80336,0,0,1-.12345-.977,9.46757,9.46757,0,0,0,1.01884-2.45451.80332.80332,0,0,1,.77784-.60255h1.1861a.91866.91866,0,0,0,.91762-.91757v-1.721a.91866.91866,0,0,0-.91762-.91756h-1.1861a.80335.80335,0,0,1-.77784-.60256,9.46944,9.46944,0,0,0-1.01884-2.4545.80338.80338,0,0,1,.12345-.977l.84023-.84023a.91726.91726,0,0,0,.00032-1.29738L21.6604,4.54355A.91737.91737,0,0,0,20.363,4.54322l-.8405.84056a.8033.8033,0,0,1-.977.12344A9.46949,9.46949,0,0,0,16.091,4.48833a.80328.80328,0,0,1-.6026-.77784V2.52423a.91867.91867,0,0,0-.91763-.91757h-1.7209a.91866.91866,0,0,0-.91762.91757V3.71038a.80328.80328,0,0,1-.60261.77784,9.46932,9.46932,0,0,0-2.45451,1.0189.80342.80342,0,0,1-.977-.12345l-.84018-.84023A.91727.91727,0,0,0,5.7606,4.54306L4.54344,5.76017a.91742.91742,0,0,0-.00032,1.29738l.84056.84056a.80337.80337,0,0,1,.12344.977,9.46743,9.46743,0,0,0-1.01884,2.45451.80332.80332,0,0,1-.77784.60255H2.52429a.91874.91874,0,0,0-.91762.91762v1.721a.91866.91866,0,0,0,.91762.91757H3.71038a.80334.80334,0,0,1,.77785.60255,9.469,9.469,0,0,0,1.01884,2.45451.80336.80336,0,0,1-.12345.977l-.84023.84023a.91728.91728,0,0,0-.00032,1.29739l1.217,1.21705a.91737.91737,0,0,0,1.29738.00032l.8405-.84056a.80714.80714,0,0,1,.97707-.12339Z'/%3E%3Cpath class='cls-1' d='M13.71023,19.67633a5.9661,5.9661,0,1,1,5.9661-5.9661A5.97283,5.97283,0,0,1,13.71023,19.67633Zm0-10.32552a4.35943,4.35943,0,1,0,4.35943,4.35942,4.36433,4.36433,0,0,0-4.35943-4.35942Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"/>
						</Box>
					</Flex>

					<Flex layerStyle='inputLike' minH='83.2px'>
						<Box flex='1' pr='0.5rem'>
							{balance0 &&
								<Box as='span' textStyle='uppercase' {...span}>
									Balance: {ethers.utils.formatUnits(balance0, token0.decimals)}&nbsp;{token0.symbol}
								</Box>
							}
							{!balance0 &&
								<br/>
							}
							<NumberInput {...flex} {...input}>
								<NumberInputField placeholder='0.0' {...field}/>
							</NumberInput>
						</Box>
						<Box
							as='button'
							display='inline-flex'
							minWidth='42px'
							onClick={() => {
								onOpen()
								setIsSelect(0)
							}}
						>
							<Image
								width='42px'
								mr='10px'
								src={token0.logoURI}
							/>
							<Box as='span' fontWeight='bold' alignSelf='center' mr='5px'>{token0.symbol}</Box>
							<TriangleDownIcon alignSelf='center'/>
						</Box>
					</Flex>

					<Box
						as='button'
						m='1rem auto'
						width='22px'
						onClick={() => {
							if (token1) {
								setToken0(token1)
								setBalance0(balance1)
								setToken1(token0)
								setBalance1(balance0)
							}
						}}
					>
						<Image m='0' height='22px' src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22.51799 24.3561'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23fff;%7D%3C/style%3E%3C/defs%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cpath class='cls-1' d='M9.35617,19.94679a.76142.76142,0,0,0,0-1.076l-.98424-.98424a.76142.76142,0,0,0-1.076,0l-.98423.98424V5.3279A2.28581,2.28581,0,0,1,8.595,3.04451,1.1432,1.1432,0,0,0,9.73673,1.90282V1.14169A1.1432,1.1432,0,0,0,8.595,0a5.33375,5.33375,0,0,0-5.3279,5.3279V18.87075l-.98423-.98424a.76143.76143,0,0,0-1.07605,0l-.98423.98424a.76142.76142,0,0,0,0,1.076l4.29752,4.298a.38129.38129,0,0,0,.5385,0Z'/%3E%3Cpath class='cls-1' d='M13.16181,4.40931a.76143.76143,0,0,0,0,1.07605l.98423.98423a.76.76,0,0,0,1.07605,0l.98423-.98423V19.0282a2.2858,2.2858,0,0,1-2.28338,2.28339,1.14321,1.14321,0,0,0-1.1417,1.14169v.76113a1.14321,1.14321,0,0,0,1.1417,1.14169,5.33374,5.33374,0,0,0,5.32789-5.3279V5.48536l.98424.98423a.76.76,0,0,0,1.076,0l.98424-.98423a.7614.7614,0,0,0,0-1.07605L17.99783.11132a.38127.38127,0,0,0-.5385,0Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"/>
					</Box>

					<Flex layerStyle='inputLike'>
						<Box flex='1' pr='0.5rem'>
							{balance1 &&
								<Box as='span' textStyle='uppercase' {...span}>
									Balance: {ethers.utils.formatUnits(balance1, token1.decimals)}&nbsp;{token1.symbol}
								</Box>
							}
							{!balance1 &&
								<br/>
							}
							<NumberInput {...flex} {...input}>
								<NumberInputField placeholder='0.0' {...field}/>
							</NumberInput>
						</Box>
						<Box
							as='button'
							display='inline-flex'
							minWidth='42px'
							onClick={() => {
								onOpen()
								setIsSelect(1)
							}}
						>
							<Image
								width='42px'
								mr='10px'
								src={token1.logoURI}
							/>
							<Box as='span' fontWeight='bold' alignSelf='center' mr='5px'>
								{token1 ? token1.symbol : 'Select a token'}
							</Box>
							<TriangleDownIcon alignSelf='center'/>
						</Box>
					</Flex>
					<Flex {...flex}></Flex>
					<Button
						minWidth='230px'
						m='2rem auto 1.7rem'
						size='lg'
						variant='solidRadial'
					>
						<Box>SWAP</Box>
					</Button>
				</Flex>
			</Box>

			<Modal
				onClose={onClose}
				isOpen={isOpen}
				scrollBehavior='inside'
				isCentered
				initialFocusRef={initialRef}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Select a token</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						display='flex'
						flexDir='column'
						p='0'>
						<Box
							p='0 1.5rem 1rem'>
							<Input
								size='lg'
								placeholder='Search name or paste address'
								onChange={e => {
									const result = searchFor(tokenList, e.target.value)
									if (result) setTokenListModified(result)
									if (result.length === 0 &&
										isEthereumAddress(e.target.value)
									) console.log(resolveUnknownERC20(e.target.value, defaults.network.provider))
								}}
							/>
						</Box>
						{tokenList &&
							<>
								<List
									width={448}
									height={600}
									itemCount={tokenListModified ? tokenListModified.length : tokenList.length}
									itemSize={64}
									itemData={{
										tokenList: tokenListModified ? tokenListModified : tokenList,
										isSelect: isSelect,
										setToken0,
										setToken1,
										onClose,
									}}>
									{TokenSelectButton}
								</List>
							</>
						}
					</ModalBody>
					<ModalFooter/>
				</ModalContent>
			</Modal>
		</>
	)
}

export default Swap