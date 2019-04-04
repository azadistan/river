module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://192.168.20.56:8076',
                ws:true,
                changOrigin:true,
                pathRewrite:{
                    '^/api':'/'
                }
            },
            '/geo': {
                target: 'http://202.111.178.10:34573',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/geo': '/'
                }
            }
        }
    }
}