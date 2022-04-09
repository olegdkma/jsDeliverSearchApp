import Vue from 'vue'
import axios from './plugins/axios'

import App from './App.vue'
import vuetify from './plugins/vuetify'

import store from './store'


Vue.config.productionTip = false

new Vue({
    axios,
    vuetify,
    store,
    render: h => h(App)
}).$mount('#app')
