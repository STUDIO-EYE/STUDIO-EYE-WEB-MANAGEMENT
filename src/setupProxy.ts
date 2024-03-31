const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app: { use: (arg0: any) => void; }){
    app.use(
        createProxyMiddleware('/api', {
            target: 'http://43.203.217.95:8080',
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


