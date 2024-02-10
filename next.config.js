/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'i.pinimg.com', //Pinterest
      'pbs.twimg.com', //Twitter
      'res.cloudinary.com' //Cloudinary
    ],
  },
  transpilePackages: ['@uiw/react-md-editor'],
  experimental: {
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;
