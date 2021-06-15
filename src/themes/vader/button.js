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
			backgroundImage: 'linear-gradient(90deg, rgb(255, 157, 219) 0%, rgb(38, 164, 254) 100%)',
			_hover: {
				backgroundImage: 'linear-gradient(90deg, rgb(254, 201, 254) 0%, rgb(56, 233, 253) 100%)',
				_disabled: {
					background: 'linear-gradient(90deg, rgb(128, 79, 110) 0%, rgb(4, 54, 89) 100%)',
				},
			},
			_active: {
				backgroundImage: 'linear-gradient(90deg, rgb(254, 201, 254) 0%, rgb(56, 233, 253) 100%)',
				opacity: '0.7',
			},
			_disabled: {
				color: '#000',
				background: 'linear-gradient(90deg, rgb(128, 79, 110) 0%, rgb(4, 54, 89) 100%)',
			},
		}),
		solidRadial: () => ({
			color: '#000',
			borderRadius: '9rem',
			backgroundImage: 'linear-gradient(90deg, rgb(255, 157, 219) 0%, rgb(38, 164, 254) 100%)',
			_hover: {
				backgroundImage: 'linear-gradient(90deg, rgb(254, 201, 254) 0%, rgb(56, 233, 253) 100%)',
				_disabled: {
					backgroundImage: 'linear-gradient(90deg, rgb(128, 79, 110) 0%, rgb(4, 54, 89) 100%)',
				},
			},
			_active: {
				backgroundImage: 'linear-gradient(90deg, rgb(254, 201, 254) 0%, rgb(56, 233, 253) 100%)',
				opacity: '0.7',
			},
			_disabled: {
				color: '#000',
				background: 'linear-gradient(90deg, rgb(128, 79, 110) 0%, rgb(4, 54, 89) 100%)',
			},
		}),
		outline: () => ({
			color: 'accent',
			border: 'none',
			backgroundSize: '150% auto',
			backgroundImage: 'linear-gradient(90deg,#f472b6  0%, #3b82f6 100%)',
			p: '1px',
			_hover: {
				backgroundSize: '150% auto',
				backgroundPosition: 'right center',
				backgroundImage: 'linear-gradient(90deg,#f472b6  0%, #3b82f6 100%)',
			},
			_active: {
				backgroundImage: 'linear-gradient(90deg,#f280bc  0%, #5391f5 100%)',
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
		ghost: () => ({
			_hover: {
				background: 'transparent',
			},
			_active: {
				background: 'transparent',
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
