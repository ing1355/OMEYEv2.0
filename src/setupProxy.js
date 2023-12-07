const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/monitoring', {
      target: 'https://192.168.182.54:8082',
      changeOrigin: true,
      secure: false
    }),
  );
};