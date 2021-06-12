export default {
	variants: {
		transparent: () => ({
			field: {
				paddingInlineStart: '0',
				paddingInlineEnd: '0',
				background: 'transparent',
				_hover: {
					background: 'transparent',
				},
				_focus: {
					border: 'none',
					background: 'transparent',
				},
			},
		}),
		filled: () => ({
			field: {
				background: '#665a81',
				_hover: {
					background: '#665a81',
				},
				_focus: {
					borderColor: 'accent',
					background: '#665a81',
				},
			},
		}),
	},
}
