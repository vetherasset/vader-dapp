import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useWallet } from 'use-wallet'
import { useLazyQuery, gql } from '@apollo/client'
import { Link } from 'react-router-dom'
import { Box, Button, Flex, Text, Image } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import defaults from '../common/defaults'

const PositionOverview = (props) => {

	const wallet = useWallet()
	const history = useHistory()
	const{ id } = useParams()

	const position = gql`
	query Items(
		$account: String!,
		$id: String!,
	) {
		nftitems(
			where: {
				id: $id,
				owner: $account,
			})
		{
			id
			owner {
				address
			}
			position {
				id
				foreignAsset {
					address
				}
				originalNative
				originalForeign
				creation
				liquidity
				isDeleted
			}
		}
	}
`

	const [fetch, { data }] = useLazyQuery(position)

	useEffect(() => {
		if(wallet.account) {
			fetch({ variables: {
				id: `${defaults.address.pool.toLocaleLowerCase()}_${id}`,
				account: String(wallet.account).toLocaleLowerCase(),
			} })
		}
	}, [wallet.account, id])

	useEffect(() => {
		if (!wallet.account) history.push('/pool')
	}, [wallet.account])

	return (
		<>
			{wallet.account &&
				<>
					<Box
						height={`calc(100vh - ${defaults.layout.header.minHeight})`}
						maxWidth={defaults.layout.container.md.width}
						m='0 auto'
						p={{ base: '5rem 1.2rem 0', md: '5rem 0 0' }}
						{...props}
					>
		 <Flex
							m='0 auto'
							p='1.8rem'
							flexDir='row'
							height='auto'
							justifyContent='space-between'
						>
							<Link
								to='/pool'
							>
								<Button
									variant='ghost'
									minW='auto'
									width='32px'
									height='32px'
									p='0'
								>
									<ArrowBackIcon
										width='26px'
										height='26px'
									/>
								</Button>
							</Link>
							<Text
								as='h4'
								fontSize='1.24rem'
								fontWeight='bolder'>
						Position
							</Text>
							<Box
								as='button'
								width='22px'
							>
								<Image m='0' height='22px' src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27.42047 27.42047'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23fff;%7D%3C/style%3E%3C/defs%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cpath class='cls-1' d='M14.57066,27.42047h-1.7209a2.52716,2.52716,0,0,1-2.52429-2.52424V24.314a11.07024,11.07024,0,0,1-1.719-.71352l-.41259.41259a2.52427,2.52427,0,0,1-3.57028-.00038L3.40731,22.79648a2.52414,2.52414,0,0,1,.00033-3.57029l.41227-.41227a11.07,11.07,0,0,1-.71352-1.719H2.52424A2.52714,2.52714,0,0,1,0,14.57071v-1.721a2.52716,2.52716,0,0,1,2.52429-2.52424h.58215A11.0716,11.0716,0,0,1,3.82,8.60655L3.40737,8.194a2.52429,2.52429,0,0,1,.00032-3.57029L4.6241,3.40737a2.524,2.524,0,0,1,3.57023.00032l.41222.41222a11.0785,11.0785,0,0,1,1.719-.71352V2.52424A2.52712,2.52712,0,0,1,12.84981,0h1.7209A2.52711,2.52711,0,0,1,17.095,2.52424v.5822a11.06956,11.06956,0,0,1,1.719.71352l.41259-.41259a2.52428,2.52428,0,0,1,3.57029.00037L24.0131,4.624a2.52414,2.52414,0,0,1-.00032,3.57028l-.41227.41228a11.07152,11.07152,0,0,1,.71352,1.719h.58215a2.52716,2.52716,0,0,1,2.52429,2.52424v1.721A2.52716,2.52716,0,0,1,24.89618,17.095H24.314a11.074,11.074,0,0,1-.71352,1.719l.41259.41259a2.52429,2.52429,0,0,1-.00032,3.57029l-1.21641,1.21635a2.524,2.524,0,0,1-3.57023-.00032l-.41222-.41222a11.07931,11.07931,0,0,1-1.719.71352v.58221A2.5271,2.5271,0,0,1,14.57066,27.42047ZM8.87507,21.91334a9.46917,9.46917,0,0,0,2.45451,1.0189.80328.80328,0,0,1,.60261.77784v1.18615a.91866.91866,0,0,0,.91762.91757h1.7209a.91866.91866,0,0,0,.91762-.91757V23.71008a.80327.80327,0,0,1,.60261-.77784,9.46917,9.46917,0,0,0,2.45451-1.0189.8033.8033,0,0,1,.977.12345l.84018.84023A.91727.91727,0,0,0,21.66,22.8774l1.21716-1.21711a.91741.91741,0,0,0,.00032-1.29738l-.84055-.84056a.80336.80336,0,0,1-.12345-.977,9.46757,9.46757,0,0,0,1.01884-2.45451.80332.80332,0,0,1,.77784-.60255h1.1861a.91866.91866,0,0,0,.91762-.91757v-1.721a.91866.91866,0,0,0-.91762-.91756h-1.1861a.80335.80335,0,0,1-.77784-.60256,9.46944,9.46944,0,0,0-1.01884-2.4545.80338.80338,0,0,1,.12345-.977l.84023-.84023a.91726.91726,0,0,0,.00032-1.29738L21.6604,4.54355A.91737.91737,0,0,0,20.363,4.54322l-.8405.84056a.8033.8033,0,0,1-.977.12344A9.46949,9.46949,0,0,0,16.091,4.48833a.80328.80328,0,0,1-.6026-.77784V2.52423a.91867.91867,0,0,0-.91763-.91757h-1.7209a.91866.91866,0,0,0-.91762.91757V3.71038a.80328.80328,0,0,1-.60261.77784,9.46932,9.46932,0,0,0-2.45451,1.0189.80342.80342,0,0,1-.977-.12345l-.84018-.84023A.91727.91727,0,0,0,5.7606,4.54306L4.54344,5.76017a.91742.91742,0,0,0-.00032,1.29738l.84056.84056a.80337.80337,0,0,1,.12344.977,9.46743,9.46743,0,0,0-1.01884,2.45451.80332.80332,0,0,1-.77784.60255H2.52429a.91874.91874,0,0,0-.91762.91762v1.721a.91866.91866,0,0,0,.91762.91757H3.71038a.80334.80334,0,0,1,.77785.60255,9.469,9.469,0,0,0,1.01884,2.45451.80336.80336,0,0,1-.12345.977l-.84023.84023a.91728.91728,0,0,0-.00032,1.29739l1.217,1.21705a.91737.91737,0,0,0,1.29738.00032l.8405-.84056a.80714.80714,0,0,1,.97707-.12339Z'/%3E%3Cpath class='cls-1' d='M13.71023,19.67633a5.9661,5.9661,0,1,1,5.9661-5.9661A5.97283,5.97283,0,0,1,13.71023,19.67633Zm0-10.32552a4.35943,4.35943,0,1,0,4.35943,4.35942,4.36433,4.36433,0,0,0-4.35943-4.35942Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"/>
							</Box>
						</Flex>
						<Flex
							m='0 auto'
							p='1.8rem'
							flexDir='column'
							layerStyle='colorful'
							height='auto'
							minH='526.4px'
							justifyContent='center'
						>
							<Flex
								flexWrap={{ base: 'wrap', md: 'nowrap' }}
							>
								<Flex
									p='0 0.3rem'
									flexDir='column'
									width={{ base: '100%', md: '50%' }}
								>
									<Text
										as='h4'
										fontSize='1.24rem'
										fontWeight='bolder'>
										Overview
									</Text>
									{data?.nftitems[0].position[0].id}
									{data?.nftitems[0].position[0].creation}
									{data?.nftitems[0].position[0].foreignAsset.address}
									{data?.nftitems[0].position[0].liquidity}
									{data?.nftitems[0].position[0].originalForeign}
									{data?.nftitems[0].position[0].originalNative}
									{data?.nftitems[0].position[0].isDeleted}
								</Flex>
							</Flex>
						</Flex>
					</Box>
				</>
			}
		</>
	)
}

export default PositionOverview