/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '/Toolbazaar',
  assetPrefix: '/Toolbazaar/',
}

module.exports = nextConfig
