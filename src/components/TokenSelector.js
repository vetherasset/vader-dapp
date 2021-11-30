import React, { useRef, useMemo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import defaults from '../common/defaults'
import { Button, Box, Image, Modal, ModalHeader, ModalCloseButton, ModalOverlay, ModalContent, ModalBody,
	ModalFooter, Input, Switch, Flex, useToast,
} from '@chakra-ui/react'
import useLocalStorageState from 'use-local-storage-state'
import { FixedSizeList as List } from 'react-window'
import { EditIcon, ArrowBackIcon } from '@chakra-ui/icons'
import { getCombinedTokenListFromSources, searchFor } from '../common/utils'
import { tokenNotAvailableToselect } from '../messages'

const TokenSelectButton = ({ data, index, style }) => {
	TokenSelectButton.propTypes = {
		index: PropTypes.number.isRequired,
		style: PropTypes.object.isRequired,
		data: PropTypes.any.isRequired,
	}
	const toast = useToast()
	return (
		<Button
			variant='ghostSelectable'
			fontWeight='600'
			fontSize='1.2rem'
			justifyContent='left'
			flexWrap='wrap'
			alignContent='center'
			p='2rem 1.5rem'
			style={data.tokenList[index].disabled ? {
				...style,
				opacity: '0.4',
				cursor: 'not-allowed',
				boxShadow: 'none',
			} : style}
			onClick={() => {
				if (data.tokenList) {
					if (!data.tokenList[index].disabled) {
						if (data.isSelect === 0) data.setToken0(data.tokenList[index])
						if (data.isSelect === 1) data.setToken1(data.tokenList[index])
					}
					else {
						toast(tokenNotAvailableToselect)
					}
				}
				data.onClose()
			}}
			key={index}>
			{data.tokenList &&
				<>
					<Box
						width='100%'
						display='inline-flex'>
						<Image
							width='24px'
							height='24px'
							borderRadius='50%'
							background='white'
							mr='10px'
							src={data.tokenList[index].logoURI}
						/>
						{data.tokenList[index].symbol}
					</Box>
					<Box
						paddingLeft='34px'
						fontSize='1rem'
						fontWeight='100'
						color='#666'
					>
						{data.tokenList[index].name}
					</Box>
				</>
			}
		</Button>
	)
}

const TokenSelectDialog = (props) => {

	TokenSelectDialog.propTypes = {
		tokenList: PropTypes.any.isRequired,
		isSelect: PropTypes.number.isRequired,
		setToken0: PropTypes.func.isRequired,
		setToken1: PropTypes.func,
		onClose: PropTypes.func.isRequired,
	}

	const [tokenListModified, setTokenListModified] = useState(false)

	return (
		<>
			<ModalHeader>Select a token</ModalHeader>
			<ModalCloseButton
				top='1.29rem'
			/>
			<ModalBody
				display='flex'
				flexDir='column'>
				<Box
					p='0 1.5rem 1.5rem'
					borderBottom='1px solid #00000017'
				>
					<Input
						size='lg'
						placeholder='Search name or paste address'
						variant='blank'
						onChange={e => {
							const result = searchFor(props.tokenList, e.target.value)
							if (result && result.length !== 0) setTokenListModified(result)
							// if (result.length === 0 &&
							// 			isEthereumAddress(e.target.value)
							// ) console.log(resolveUnknownERC20(e.target.value, defaults.network.provider))
						}}
					/>
				</Box>
				{props.tokenList &&
							<>
								<List
									width='100%'
									maxWidth={448}
									height={600}
									itemCount={tokenListModified ? tokenListModified.length : props.tokenList.length}
									itemSize={64}
									style={{
										scrollbarColor: 'rgb(134, 134, 134) transparent',
									}}
									itemData={{
										tokenList: tokenListModified ? tokenListModified : props.tokenList,
										isSelect: props.isSelect,
										setToken0: props.setToken0,
										setToken1: props.setToken1,
										onClose: props.onClose,
									}}>
									{TokenSelectButton}
								</List>
							</>
				}
			</ModalBody>
		</>
	)
}

const TokenListSelectDialog = (props) => {

	TokenListSelectDialog.propTypes = {
		tokenListSources: PropTypes.array.isRequired,
		setTokenListSources: PropTypes.func.isRequired,
		setDialog: PropTypes.func.isRequired,
	}

	return (
		<>
			<ModalHeader
				textAlign='center'
				borderBottom='1px solid #00000017'
			>
				<Button
					variant='ghostDark'
					minW='auto'
					width='32px'
					height='32px'
					position='absolute'
					top='1.29rem'
					left='0.75rem'
					p='0'
					onClick={() => props.setDialog(0)}
				>
					<ArrowBackIcon
						width='18px'
						height='18px'
					/>
				</Button>
				Manage
				<ModalCloseButton
					top='1.29rem'
				/>
			</ModalHeader>
			<ModalBody
				display='flex'
				flexDir='column'
				p='1.8rem 0 0'>
				{props.tokenListSources.map((source, index) => {
					return (
						<Flex
							m='0 1.3rem 0'
							p='0 1.6rem'
							borderRadius='1.4rem'
							minH='5rem'
							justifyContent='space-between'
							alignItems='center'
							key={index}
						>
							<Image
								width='33px'
								height='33px'
								objectFit='contain'
								src={source.logoURI}/>
							<Box
								as='h3'
								m='0'
								fontSize='1.1rem'
								fontWeight='bold'
								textTransform='capitalize'>
								{source.name}
							</Box>
							<Switch
								size='lg'
								isDisabled={index === 0 ? true : false}
								isChecked={index === 0 ? true : source.enabled}
								onChange={() => {
									source.enabled = !source.enabled
									props.setTokenListSources([ ...props.tokenListSources ])
								}}
							/>
						</Flex>
					)
				})}
			</ModalBody>
		</>
	)
}

export const TokenSelector = (props) => {

	TokenSelector.propTypes = {
		isSelect: PropTypes.number.isRequired,
		setToken0: PropTypes.func.isRequired,
		setToken1: PropTypes.func,
		disableManage: PropTypes.bool,
		tokenList: PropTypes.array,
		isOpen: PropTypes.bool.isRequired,
		onOpen: PropTypes.func.isRequired,
		onClose: PropTypes.func.isRequired,
	}

	const initialRef = useRef()
	const [dialog, setDialog] = useState(0)

	const [tokenListSources, setTokenListSources] = useLocalStorageState('tokenListSources', defaults.tokenList.sources)
	const [tokenListCombined, setTokenListCombined] = useState(false)
	const tokenList = useMemo(() => tokenListCombined, [tokenListCombined])

	useEffect(() => {
		if (!props.isOpen) setDialog(0)
	}, [props.isOpen])

	useEffect(() => {
		if (!Array.isArray(props.tokenList)) {
			getCombinedTokenListFromSources(
				tokenListSources,
			)
				.then(data => {
					setTokenListCombined(data)
				})
				.catch(err => {
					setTokenListCombined(false)
					console.log(err)
				})
		}
		else {
			setTokenListCombined(props.tokenList)
		}
	}, [tokenListSources, props.tokenList])

	return (
		<>
			<Modal
				onClose={props.onClose}
				isOpen={props.isOpen}
				scrollBehavior='inside'
				isCentered
				initialFocusRef={initialRef}>
				<ModalOverlay />
				<ModalContent minHeight='801px'>
					<Box height='736px'>
						{dialog === 0 &&
							<TokenSelectDialog
								height='736px'
								tokenList={tokenList}
								isSelect={props.isSelect}
								setToken0={props.setToken0}
								setToken1={props.setToken1}
								onClose={props.onClose}
							/>
						}
						{dialog === 1 &&
							<TokenListSelectDialog
								tokenListSources={tokenListSources}
								setTokenListSources={setTokenListSources}
								setDialog={setDialog}
							/>
						}
					</Box>
					{dialog === 0 &&
						<ModalFooter
							borderTop='1px solid #00000017'
							justifyContent='center'>
							{!typeof props.disableManage === 'boolean' &&
								!props.disableManage === false &&
									<>
										<Button
											variant='link'
											fontWeight='bold'
											fontSize='1.1rem'
											onClick={() => setDialog(1)}
										>

											<EditIcon mr='6px'/> Manage Token Lists
										</Button>
									</>
							}
						</ModalFooter>
					}
				</ModalContent>
			</Modal>
		</>
	)
}
