const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app: any){
    app.use(
        createProxyMiddleware('/api', {
            target: 'http://3.36.120.219:8080',
            changeOrigin: true
        })
    )

    app.use(
        createProxyMiddleware( '/user-service', {
            target: 'http://43.203.217.95:8080',
            changeOrigin: true
        })
    );
};


