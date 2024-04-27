const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app: any){
    app.use(
        createProxyMiddleware('/api', {
            target: 'http://43.201.98.4:8000',
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


