import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(ElementUi)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
