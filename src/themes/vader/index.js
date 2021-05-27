import { mode } from '@chakra-ui/theme-tools'
import fonts from './fonts'
import typography from './typography'
import colors from './colors'
import badge from './badge'
import button from './button'
import tooltip from './tooltip'
import input from './input'
import numberInput from './numberinput'
import select from './select'
import menuitem from './menuitem'
import link from './link'
import { extendTheme } from '@chakra-ui/react'
import spinner from './spinner'

const overrides = {
	config: {
		useSystemColorMode: false,
		initialColorMode: 'dark',
	},
	styles: {
		global: props => ({
			body: {
				fontSize: '1em',
				fontWeight: 'normal',
				color: 'white',
				bg: mode('#000000', '#000000')(props),
			},
			'input::placeholder': {
				color: '#000',
			},
			'.chakra-alert button:focus': {
				boxShadow: '0 0 0 3px #7b7ce0',
			},
			'.chakra-toast__inner': {
				width: '30vw',
			},
			h1: {
				textTransform: 'uppercase',
				margin: '0 0 1rem',
			},
			h2: {
				margin: '0 0 1.5rem',
			},
			h3: {
				margin: '0 0 1rem',
			},
			h4: {
				margin: '0 0 0.5rem',
			},
			'img[src=\'\']': {
				opacity: '0',
			},
			'img:not([src])': {
				opacity: '0',
			},
		}),
	},
	fonts: fonts,
	textStyles: typography,
	colors: colors,
	components: {
		Button: button,
		Input: input,
		NumberInput: numberInput,
		Badge: badge,
		Tooltip: tooltip,
		Select: select,
		MenuItem: menuitem,
		Link: link,
		Spinner: spinner,
		Toast: {
			minWidth: '440px',
			baseStyle: {
				bg: 'red',
			},
		},
	},
	layerStyles: {
		overview: {
			bg: 'black',
			border: '1px solid #ffc300ce',
			borderRadius: '19px',
			marginBottom: '15px',
			p: '19px',
			minHeight: '95px',
			boxShadow: '0px 0px 32px -20px #ffffff9c',
		},
		actionPanel: {
			display: 'flex',
			width: '100%',
			justifyContent: 'center',
		},
	},
}

export default extendTheme(overrides)
