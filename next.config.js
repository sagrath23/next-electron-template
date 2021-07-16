module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.target = 'electron-renderer';

    return config;
  }
}
