import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        clientWidth: document.documentElement.clientWidth,
        clientHeight: document.documentElement.clientHeight,
        userId:'122411330001846',
        // mapUrl:'http://10.10.101.{s}:8088/map/{z}/{x}/{y}/tile.png',
        // mapSubdomains:{subdomains: ['74','75','76']},
        mapUrl:'http://t{s}.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk=05861044e5fe4135647facbd39abc543',
        mapSubdomains:{subdomains: ['0', '1', '2', '3', '4', '5', '6', '7']},

        baseUrl:'/geo/geoserver/WCXT/wms',
        baseUrl2:'/geo/geoserver/WCXT/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WCXT:wcj_rubbish&outputFormat=application%2Fjson',
        // layersName:'WCXT:WCImage0040',
        layersName:'WCXT:WCImage0040',
        layerFormat:"image/png",
        mapBounds:[[20.167,110.463,],[19.353,111.047]]
    },
    mutations: {
        setClientHeight (state, n) {
            state.clientHeight = n
        },
        setClientWidth (state, n) {
            state.clientWidth = n
        },
        setUserId (state, n) {
            state.userId = n
        },
    },
    actions: {

    }
})
