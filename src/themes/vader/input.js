export default {
	variants: {
		filled: (props) => ({
			field: {
				_hover: {
					bg: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgb(168 168 168)',
				},
				_focus: {
					bg: props.colorMode === 'dark' ? 'rgba(21, 21, 21, 0.23)' : 'rgb(255, 255, 255)',
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
