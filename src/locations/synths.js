import React, { useState } from 'react'
import { Box, Flex, Text, Button, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import defaults from '../common/defaults'

import SynthsMint from '../components/SynthsMint'
import SynthsStake from '../components/SynthsStake'
import SynthsUnStake from '../components/SynthsUnStake'
const Synths = ()=>{
	const [token ] = useState({
		name: 'apr',
		symbol : 'APR',
	})

	const [stakeRate] = useState('9.00')

	return(
		<Box
			maxWidth={defaults.layout.container.sm.width}
			m='0 auto'
			pt='5rem'
			height={`calc(100vh - ${defaults.layout.header.minHeight})`}
		>
			<Flex
				justifyContent='center'
				layerStyle='colorful'
				maxW='49ch'
				m='0 auto'
				p='1.8rem'
			>
				<Flex direction='row' justifyContent='space-between' width='100%'>
					<Flex direction='column' alignItems='center'>
						<Text fontWeight="bolder">Stacking {token.symbol}</Text>
						<Button borderRadius='10px' fill='none' backgroundColor="none" fontSize=".8rem"> View Stats</Button>
					</Flex>
					<Flex direction='column' alignItems='center'>
						<Text>{stakeRate}%</Text>
						<Text>Yesterday&apos;s {token.symbol}</Text>
					</Flex>
				</Flex>
			</Flex>
			<Flex
				justifyContent='center'
				layerStyle='colorful'
				maxW='49ch'
				m='1rem auto'
				p='1.8rem'
			>
				<Tabs layerStyle="colorful">
					<TabList>
						<Tab>Mint</Tab>
						<Tab>Stake</Tab>
						<Tab>Unstake</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<SynthsMint/>
						</TabPanel>
						<TabPanel>
							<SynthsStake/>
						</TabPanel>
						<TabPanel>
							<SynthsUnStake/>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Flex>
		</Box>

	)
}

export default Synths
