export default {
	baseStyle: {
		borderBottom: '1px solid #fff0',
		_hover: {
			textDecoration: 'none',
			color: '#3fa3fa',
		},
		_focus: {
			boxShadow: '0 0 0 3px #7b7ce0',
		},
	},
	variants: {
		underline: () => ({
			_hover: {
				textDecoration: 'underline',
				color: '#000',
				borderBottom: 'none',
			},
		}),
	},
}