export default {
	variants: {
		filled: () => ({
			field: {
				background: 'white',
				borderColor: 'accent',
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
