const { GenerateSW } = require('workbox-webpack-plugin');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack(/** @type {import('webpack').Configuration} */ config, options) {
    if (options.isServer || options.isDev) {
      return config;
    }

    config.plugins.push(
      new GenerateSW({
        swDest: 'static/service-worker.js',
        include: [/.*static.*/i]
      })
    );

    return config;
  },
}
