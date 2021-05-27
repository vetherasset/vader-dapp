export default {
	variants: {
		filled: props => ({
			field: {
				bg: props.colorMode === 'red',
				_hover: {
					bg: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgb(168 168 168)',
				},
				_focus: {
					bg: props.colorMode === 'dark' ? 'rgba(21, 21, 21, 0.23)' : 'rgb(255, 255, 255)',
				},
			},
		}),
	},
}
