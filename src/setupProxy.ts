const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app: any){
    app.use(
        createProxyMiddleware('/api', {
            target: 'http://43.201.95.252:8000',
            changeOrigin: true
        })
    )

    app.use(
        createProxyMiddleware( '/user-service', {
            target: 'http://43.201.95.252:8000',
            changeOrigin: true
        })
    );
};


