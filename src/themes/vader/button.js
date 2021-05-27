export default {
	baseStyle: {
		fontFamily: 'Button',
		lineHeight: '0px',
		borderRadius: '4px',
		_focus: {
			boxShadow: '0 0 0 3px #7b7ce0',
		},
	},
	variants: {
		solid: () => ({
			color: '#000',
			transition: '1s',
			backgroundSize: '150% auto',
			backgroundImage: 'linear-gradient(90deg,#f472b6  0%, #3b82f6 100%)',
			_hover: {
				backgroundSize: '150% auto',
				backgroundPosition: 'right center',
				backgroundImage: 'linear-gradient(90deg,#f472b6  0%, #3b82f6 100%)',
			},
			_active: {
				backgroundSize: '150% auto',
				backgroundPosition: 'right center',
				backgroundImage: 'linear-gradient(90deg, rgba(244,139,194,1) 0%, rgba(83,145,245,1) 100%)',
			},
			_disabled: {
				bg: 'transparent',
			},
		}),
		outline: () => ({
			color: 'accent',
			border: 'none',
			p: '43px',
			transition: '1s',
			_hover: {
				transition: '1s',
				color: 'red',
				background: 'red',
			},
			_active: {
				bg: '#f472b6',
			},
			_disabled: {
				bg: 'transparent',
			},
		}),
		link: () => ({
			color: '#fff',
			height: 'auto',
    	padding: '0',
			_active: {
				color: '#fff',
				opacity: '0.6',
			},
		}),
		linkAccent: () => ({
			color: 'accent',
			height: 'auto',
    	padding: '0',
			_hover: {
				textDecoration: 'underline',
			},
			_active: {
				color: 'accent',
				opacity: '0.6',
			},
		}),
	},
}
