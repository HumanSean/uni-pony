import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import './styles.scss';
import store from './store';

import "./assets/iconfont/iconfont";

import axios from "axios";

Vue.prototype.$axios = axios;
Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
