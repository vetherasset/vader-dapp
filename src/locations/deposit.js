import React, { useState } from 'react'
import {
	Box, Button,
	Flex, FormControl,
	FormErrorMessage,
	FormLabel,
	NumberInput,
	NumberInputField, Spinner, useToast,
} from '@chakra-ui/react'
import defaults from '../common/defaults'
import { depositToken } from '../common/ethereum'
import { USDV } from '../common/consts'

const Deposit = ()=>{

	const [submitting, setSubmitting] = useState(false)
	const [depositAmount, setDepositAmount] = useState(0)

	const toast = useToast()

	const deposit = async ()=>{
	  if(!depositAmount || depositAmount <= 0) {
	    return
		}
		setSubmitting(true)
		try{
			const result = await depositToken({ token:  USDV, amount: depositAmount.toString() })
			if(result && result.hash) {
				toast({
					title: 'Transaction submitted',
					description: <Box wordBreak="break-all">You can check the result later on Etherscan with tx id: <p>{result.hash}</p></Box>,
					status: 'success',
				})
			}
			else{
				toast({
					title: 'Error',
					description: <Box wordBreak="break-all">Error occurred</Box>,
					status: 'error',
				})
			}
		}
		catch (e) {
	    console.log(e)
			toast({
				title: 'Error',
				description: <Box wordBreak="break-all">{e && e.message ? e.message : 'Error, please try again later'}</Box>,
				status: 'error',
				isClosable:true,
			})
		}
		finally {
			setSubmitting(false)
		}

		setSubmitting(false)
	}
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
				p='1.8rem'
			>
				<FormControl id='assetToDeposit'>
					<FormLabel fontSize='1.2rem' fontWeight='bolder'> Asset amount to deposit</FormLabel>
					<FormErrorMessage />
					<Flex layerStyle='inputLike'>
						<Box flex='1' pr='0.5rem'>
							<NumberInput>
								<NumberInputField placeholder='0.0' border='none'
									value={depositAmount} onChange={(e)=>{
										setDepositAmount(Number(e.target.value))
									}}
									fontSize='1.5rem' />
							</NumberInput>
						</Box>
					</Flex>
					<Box d='flex' justifyContent='center' marginY='1.5rem'>
						<Button variant='solidRadial'
							m='0 auto'
							size='lg'
							minWidth='230px'
							textTransform='uppercase'
							color='white'
							onClick={deposit}>
							<Spinner display={submitting ? 'block' : 'none'} mr="1rem"/>
              Deposit
						</Button>
					</Box>
				</FormControl>
			</Flex>
		</Box>
	)
}

export default Deposit