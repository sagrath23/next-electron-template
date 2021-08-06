module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.target = 'electron-main';

    console.log(config.plugins, 'plugins');
    console.log(config.pluginOptions, 'options');

    return config;
  }
}
