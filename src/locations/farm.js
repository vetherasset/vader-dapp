import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Box, Button, Flex, Text, Tab, TabList, Tabs, TabPanels, TabPanel, NumberInput, NumberInputField,
  InputGroup, InputRightElement, useToast, Image, Container, Heading, Badge,
} from '@chakra-ui/react'
import defaults from '../common/defaults'
import { useWallet } from 'use-wallet'
import { ethers } from 'ethers'

const Farm = props => {
  return (
    <Box
      height={`calc(100vh - ${defaults.layout.header.minHeight})`}
      maxWidth={defaults.layout.container.lg.width}
      m='0 auto'
      p={{ base: '5rem 1.2rem 0', md: '5rem 0 0' }}
      {...props}
    >
      <Flex></Flex>
    </Box>
  )
}

export default Farm
