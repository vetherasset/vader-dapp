import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import defaults from '../common/defaults'
import {
	Button,
	Box,
	Modal,
	ModalContent,
	Flex,
	NumberInput,
	NumberInputField,
	InputRightElement,
	InputLeftElement,
} from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'

export const TransactionSettings = (props) => {

	TransactionSettings.propTypes = {
		isOpen: PropTypes.bool.isRequired,
		onOpen: PropTypes.func.isRequired,
		onClose: PropTypes.func.isRequired,
		onAuto: PropTypes.func.isRequired,
		onSlippage: PropTypes.func.isRequired,
		onDeadline: PropTypes.func.isRequired,
		auto: PropTypes.bool.isRequired,
		slippage: PropTypes.any.isRequired,
		deadline: PropTypes.any.isRequired,
	}

	const initialRef = useRef()
	const [auto, setAuto] = useState(true)
	const [slippage, setSlippage] = useState(defaults.swap.slippage)
	const [deadline, setDeadline] = useState(defaults.swap.deadline)

	useEffect(() => {
		props.onSlippage(slippage)
	}, [slippage])

	useEffect(() => {
		props.onDeadline(deadline)
	}, [deadline])

	return (
		<>
			<Modal
				onClose={props.onClose}
				isOpen={props.isOpen}
				scrollBehavior='inside'
				initialFocusRef={initialRef}>
				<ModalContent width='350px' minHeight='200px' p='16px' mt='240px'>
					<Box>
						<Box as='h3' mb='1' fontSize='1.1rem' fontWeight='bold'>Transaction Settings</Box>
						<Box as='h3' mb='2' fontSize='1.0rem'>Slippage tolerance ?</Box>
						<Flex mb='2' gridGap='3' fontSize='1.0rem'>
							<Button
								size='sm'
								variant='solidRadial'
								background={ props.auto ? 'red' : null }
								onClick={() => { setAuto(true), props.onAuto(true), setSlippage(defaults.swap.slippage) }}
							>
								<Box
									fontWeight='1000'
								>
									Auto
								</Box>
							</Button>
							<NumberInput size='sm' width='100%' value={props.slippage}>
								<InputLeftElement color='#f3841e'><WarningIcon/></InputLeftElement>
								<NumberInputField
									borderRadius='50px'
									background='#ffe5fe'
									outline='2px solid #eec5de'
									placeholder='0.50'
									textAlign='right'
									fontSize='1.0rem'
									color={
										props.slippage < defaults.swap.minSlippage
											|| props.slippage > defaults.swap.maxSlippage
											? 'red' : null
									}
									onChange={(e) => { setSlippage(e.target.value), setAuto(false), props.onAuto(false)}}
								/>
								<InputRightElement>%</InputRightElement>
							</NumberInput>
						</Flex>
						<Box
							as='h3'
							mb='2'
							fontSize='1.0rem'
							color={ slippage > 50 || slippage < 0 ? 'red' : '#f3841e'}
						>
							{
								slippage > 50 || slippage < 0
									? 'Enter a valid slippage percentage'
									: slippage < defaults.swap.minSlippage
										? 'Your transaction may fail'
										: slippage > defaults.swap.maxSlippage
											? 'Your transaction may be frontrun'
											: null
							}
						</Box>
						<Box as='h3' mb='2' fontSize='1.0rem'>Transaction deadline ?</Box>
						<Flex mb='1' gridGap='3' fontSize='1.0rem'>
							<NumberInput size='sm' width='100px' value={props.deadline}>
								<NumberInputField
									pr='4'
									borderRadius='50px'
									background='#ffe5fe'
									outline='2px solid #eec5de'
									placeholder='30'
									textAlign='right'
									fontSize='1.0rem'
									color={
										props.deadline < defaults.swap.minDeadline
											|| props.deadline > defaults.swap.maxDeadline
											? 'red' : null
									}
									onChange={(e) => { setDeadline(e.target.value) }}
								/>
							</NumberInput>
							<Box as='h3' mb='0' fontSize='1.0rem' alignSelf='center'>minutes</Box>
						</Flex>
					</Box>
				</ModalContent>
			</Modal>
		</>
	)
}
