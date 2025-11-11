import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration Next.js moderne avec optimisations
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  experimental: {
    optimizePackageImports: ['framer-motion', 'lottie-react'],
  },
  // Force Turbopack à utiliser ce dossier comme racine du workspace
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig