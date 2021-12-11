export default {
	variants: {
		outline: () => ({
			container: {
				borderRadius: '12px',
				color: '#fff',
				boxShadow: 'inset 0 0 0px 1px rgba(255, 255, 255, 0.16)',
				background: 'rgba(255, 255, 255, 0.08)',
			},
		}),
	},
	colorScheme: {
		vader: () => ({
			color: '#red',
			background: 'rgba(214, 188, 250, 0.16)',
		}),
	},
}