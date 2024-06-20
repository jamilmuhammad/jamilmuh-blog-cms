/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'i.pinimg.com', //Pinterest
      'pbs.twimg.com', //Twitter
      'res.cloudinary.com' //Cloudinary
    ],
  },
  experimental: {
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;
