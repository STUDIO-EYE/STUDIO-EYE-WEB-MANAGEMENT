const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app: any){
    app.use(
        createProxyMiddleware('/api', {
            target: 'http://15.165.17.72:8080',
            changeOrigin: true
        })
    )

    app.use(
        createProxyMiddleware( '/user-service', {
            target: 'http://13.125.37.8:8080',
            changeOrigin: true
        })
    );
};


