export default {
	variants: {
		filled: () => ({
			field: {
				borderRadius: '0.8rem',
				background: '#000',
				borderStyle: 'solid',
				borderWidth: '2px',
				borderColor: 'accent',
				_placeholder: {
					color: '#fff',
				},
				_hover: {
					background: '#000',
				},
				_focus: {
					borderColor: '#ff8ac0',
					background: '#000',
				},
			},
		}),
		blank: () => ({
			field: {
				borderRadius: '0.8rem',
				background: 'white',
				borderStyle: 'solid',
				borderWidth: '2px',
				borderColor: 'accent',
				_hover: {
					background: 'white',
				},
				_focus: {
					borderColor: '#ff8ac0',
					background: 'white',
				},
			},
		}),
	},
}
