const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
    app.use(
        createProxyMiddleware('/api', {
            target: 'http://13.125.181.139:8000',
            // target: 'http://localhost:8000/',
            changeOrigin: true
        })
    )
    // 로그인서비스로 가는 ip:port 넣고(게이트웨이 통해서 가는거니까 나중에 게이트웨이로 연결되면 로그인서비스랑 매네지먼트서비스랑 똑같이 적으면 됌)
    // 컨트롤러 시작 url이 뭔지 적어서 알려주면 돼!  13.125.181.139:8080/

    app.use(
        createProxyMiddleware( '/user-service',{
            target: 'http://13.125.181.139:8000',
            // target: 'http://localhost:8000/',
            changeOrigin: true
        })
    );
};