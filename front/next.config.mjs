/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    output: "standalone",
    basePath: '',
    assetPrefix: process.env.NODE_ENV === 'production' ? 'https://mindcode.cat' : '',
    // webpack(config, options) {
    //     if (options.isServer) config.devtool = 'source-map';
    //     return config;
    // },
};

export default nextConfig;
