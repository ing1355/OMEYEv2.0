const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/monitoring', {
      target: 'https://omsecurity.kr:58081',
      changeOrigin: true,
      secure: false
    }),
  );
};