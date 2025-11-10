module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        glowBlue: '#00d4ff',
        glowPink: '#ff2fb6'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at 50% 50%, var(--tw-gradient-stops))',
        'radial-glow': 'radial-gradient(circle at 50% 50%, rgba(0,212,255,0.15), transparent 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 6s ease-in-out infinite',
        'rotate-slow': 'spin 40s linear infinite'
      }
    }
  },
  plugins: []
};

