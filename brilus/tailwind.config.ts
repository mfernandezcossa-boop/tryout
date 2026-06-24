import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '0',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	screens: {
  		sm: '375px',
  		md: '768px',
  		lg: '1024px',
  		xl: '1440px'
  	},
  	extend: {
  		spacing: {
  			'8': '8px',
  			'16': '16px',
  			'24': '24px',
  			'40': '40px',
  			'48': '48px',
  			'64': '64px',
  			'80': '80px',
  			'112': '112px',
  			'128': '128px'
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			brand: {
  				coral: 'hsl(var(--brand-coral))',
  				'coral-10': 'hsl(var(--brand-coral-10))',
  				'coral-25': 'hsl(var(--brand-coral-25))',
  				'coral-50': 'hsl(var(--brand-coral-50))',
  				blue: 'hsl(var(--brand-blue))',
  				'blue-10': 'hsl(var(--brand-blue-10))',
  				'blue-25': 'hsl(var(--brand-blue-25))',
  				'blue-50': 'hsl(var(--brand-blue-50))',
  				amber: 'hsl(var(--brand-amber))',
  				'amber-10': 'hsl(var(--brand-amber-10))',
  				'amber-25': 'hsl(var(--brand-amber-25))',
  				'amber-50': 'hsl(var(--brand-amber-50))',
  				grey: 'hsl(var(--brand-grey))',
  				'grey-dark': 'hsl(var(--brand-grey-plus10))',
  				'grey-light': 'hsl(var(--brand-grey-minus10))',
  				black: 'hsl(var(--brand-black))',
  				white: 'hsl(var(--brand-white))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			brilus: '8px',
  			'brilus-card': '14px',
  			'brilus-inner': '10px',
  			'brilus-badge': '12px',
  			'brilus-pill': '9999px',
  			'brilus-code': '4px'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		fontFamily: {
  			sans: [
  				'Instrument Sans',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif',
  				'Apple Color Emoji',
  				'Segoe UI Emoji',
  				'Segoe UI Symbol',
  				'Noto Color Emoji'
  			]
  		},
  		letterSpacing: {
  			brilus: '-1px',
  			'brilus-ui': '-0.05em'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
