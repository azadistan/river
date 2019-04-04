import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import router from './router'
import store from './store'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Vuex from 'vuex'
import axios from 'axios'
import echarts from 'echarts'
import JsonExcel from 'vue-json-excel'


Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts
/* leaflet icon */
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

Vue.use(Vuex, {
  iconfont: 'mdi'
})
Vue.use(axios)
Vue.component('downloadExcel', JsonExcel)

export default store
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


