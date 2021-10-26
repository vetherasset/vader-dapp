export default {
	variants: {
		filled: () => ({
			field: {
				borderRadius: '0.8rem',
				background: '#13070e',
				borderStyle: 'solid',
				borderWidth: '2px',
				borderColor: 'accent.100',
				_placeholder: {
					color: '#fff',
				},
				_hover: {
					background: '#13070e',
				},
				_focus: {
					borderColor: '#ff8ac0',
					background: '#13070e',
				},
			},
		}),
		blank: () => ({
			field: {
				borderRadius: '0.8rem',
				background: 'white',
				borderStyle: 'solid',
				borderWidth: '2px',
				borderColor: 'accent.100',
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
