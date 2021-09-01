export default {
	variants: {
		filled: () => ({
			field: {
				background: 'white',
				borderColor: 'accent.100',
				_hover: {
					background: 'white',
				},
				_focus: {
					borderColor: '#ffd000',
					background: 'white',
				},
			},
		}),
	},
}
