export default {
	variants: {
		transparent: () => ({
			field: {
				color: '#fff',
				_placeholder: {
					color: '#fff',
					fontWeight: '400',
				},
				paddingInlineStart: '0',
				paddingInlineEnd: '0',
				background: 'transparent',
				_disabled: {
					opacity: '0.1',
				},
				_hover: {
					background: 'transparent',
				},
				_focus: {
					border: 'none',
					background: 'transparent',
				},
				InputRightAddon: {
					background: 'red',
				},
			},
		}),
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
		outline: () => ({
			field: {
				color: '#fff',
				borderRadius: '0.8rem',
				_placeholder: {
					color: '#fff',
				},
				_focus: {
					borderColor: '#7b7ce0',
					boxShadow: '0 0 0 3px #7b7ce0',
				},
			},
		}),
	},
}
