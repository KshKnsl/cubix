/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.picgifs.com'],
    unoptimized: true,
  },
  output: 'export',
  // Set the base path to match your GitHub repository name
  // e.g., if your repository is username/cubix, use '/cubix'
  // Leave as empty string if you're using a custom domain or deploying to root
  basePath: process.env.NODE_ENV === 'production' ? '/cubix' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/cubix/' : '',
};

export default nextConfig;
