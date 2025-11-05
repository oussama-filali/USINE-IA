import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Optimisations pour 60 FPS
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Expérimental pour Turbopack
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three'],
  },
  
  // Configuration Turbopack
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
