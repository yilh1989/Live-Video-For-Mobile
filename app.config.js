const config = {
  server: {
    host: '192.168.0.65', // IP 地址
    port: 8000, // 端口号
  },
  copyFile: [
    // { from: './single_part', to: './' },
    { from: './config.js', to: './config.js' },
  ],
  html: [
    {
      title: 'Mobile-Video',
      links: [
        // './static/bootstrap_part.min.css',
      ],
      meta: [
        {
          content: "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no",
          name: "viewport"
        }
      ],
      scripts: [
        './config.js',
        // `./js/index.entry.js`,
        './static/polyfill.min.js',
      ],
    },
  ],
  entry: './src/index',
};

module.exports = config;