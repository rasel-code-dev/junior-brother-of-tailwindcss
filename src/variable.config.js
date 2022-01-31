
function negative(item={}){
	let n = {}
	for (let itemKey in item) {
		n[`-${itemKey}`] = `-${item[itemKey]}`
	}
	return n
}

module.exports = {
	variants: ["backgroundColor", "textColor", "display", "justifyContent", "margin"],
	theme: {
		// screens: {
		// 	sm: '576px',
		// },
		colors: {
			primary: '#877EFF',
			info: '#4fe740',
			secondary: '#ef7859',
			danger: '#ff363c',
		},
		spacing: {
			// px: '1px',
			// 0: '0px',
			// 0.5: '0.125rem',
			// '1': '0.25rem',
			// 1.5: '0.375rem',
			// 2: '0.5rem',
			// 2.5: '0.625rem',
			// 3: '0.75rem',
			// 3.5: '0.875rem',
			4: '1rem',
			5: '1.25rem',
			6: '1.5rem',
			7: '1.75rem',
			8: '2rem',
			9: '2.25rem',
			10: '2.5rem'
		},
		backgroundColor: (theme) => theme('colors'),
		textColor: (theme) => theme('colors'),
		backgroundOpacity: (theme) => theme('opacity'),
		// backgroundSize: {
		//   auto: 'auto',
		//   cover: 'cover',
		//   contain: 'contain',
		// },
		flex: {
			1: "1",
			2: "2",
			3: "3",
			4: "4",
			5:"5",
			6: "6",
			7: "7",
			8: "8",
			9:"9",
			10:"10",
			11:"11",
			12:"12"
		},
		fontSize: {
			xs: "0.75rem",
			sm: "0.872rem",
			base: "1rem",
			md: "0.945rem",
			lg: "1.125rem",
			xl: "1.25rem",
			"2xl": "1.5rem",
			"3xl": "1.875rem",
			"4xl": "2.25rem",
			"5xl": "3rem",
			"6xl": "3.75rem",
			"7xl": "4.5rem",
			"8xl": "6rem"
		},
		fontWeight: {
			100: '100',
			200: '200',
			300: '300',
			400: '400',
			500: '500',
			600: '600',
			700: '700',
			800: '800',
			900: '900',
		},
		margin: (theme) => ({
			auto: 'auto',
			...theme('spacing'),
			// ...negative(theme('spacing')),
		}),
		zIndex: {
			auto: 'auto',
			0: '0',
			10: '10',
			20: '20',
			30: '30',
			40: '40',
			50: '50',
		},
	}
}
