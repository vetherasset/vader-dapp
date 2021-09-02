import React, { useRef, useMemo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import defaults from '../common/defaults'
import { Button, Box, Image, Modal, ModalHeader, ModalCloseButton, ModalOverlay, ModalContent, ModalBody,
	ModalFooter, Input,
} from '@chakra-ui/react'
import { FixedSizeList as List } from 'react-window'
import { EditIcon } from '@chakra-ui/icons'
import getTokenList from 'get-token-list'
import { resolveUnknownERC20 } from '../common/ethereum'
import { isEthereumAddress, searchFor } from '../common/utils'

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
			flexWrap='wrap'
			alignContent='center'
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
					<Box
						width='100%'
						display='inline-flex'>
						<Image
							width='24px'
							height='24px'
							borderRadius='50%'
							background='white'
							objectFit='none'
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
		setToken1: PropTypes.func.isRequired,
		onClose: PropTypes.func.isRequired,
	}

	const [tokenListModified, setTokenListModified] = useState(false)

	return (
		<>
			<ModalHeader>Select a token</ModalHeader>
			<ModalCloseButton />
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
							if (result) setTokenListModified(result)
							if (result.length === 0 &&
										isEthereumAddress(e.target.value)
							) console.log(resolveUnknownERC20(e.target.value, defaults.network.provider))
						}}
					/>
				</Box>
				{props.tokenList &&
							<>
								<List
									width={448}
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

const TokenListSelectDialog = () => {

	return (
		<>
			<ModalHeader
				borderBottom='1px solid #00000017'
			>Manage</ModalHeader>
			<ModalCloseButton />
			<ModalBody
				display='flex'
				flexDir='column'>
					Toggles
			</ModalBody>
		</>
	)
}

export const TokenSelector = (props) => {

	TokenSelector.propTypes = {
		isSelect: PropTypes.number.isRequired,
		setToken0: PropTypes.func.isRequired,
		setToken1: PropTypes.func.isRequired,
		isOpen: PropTypes.bool.isRequired,
		onOpen: PropTypes.func.isRequired,
		onClose: PropTypes.func.isRequired,
	}

	const initialRef = useRef()
	const [dialog, setDialog] = useState(0)

	const [tokenListDefault, setTokenListDefault] = useState(false)
	const tokenList = useMemo(() => tokenListDefault.tokens, [tokenListDefault])

	useEffect(() => {
		if (!props.isOpen) setDialog(0)
	}, [props.isOpen])

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

	return (
		<>
			<Modal
				onClose={props.onClose}
				isOpen={props.isOpen}
				scrollBehavior='inside'
				isCentered
				initialFocusRef={initialRef}>
				<ModalOverlay />
				<ModalContent>
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
							<TokenListSelectDialog/>
						}
					</Box>
					<ModalFooter
						borderTop='1px solid #00000017'
						justifyContent='center'>
						<Button
							variant='link'
							fontWeight='bold'
							fontSize='1.1rem'
							onClick={() => setDialog(1)}
						>
							<EditIcon mr='6px'/> Manage Token Lists
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}
