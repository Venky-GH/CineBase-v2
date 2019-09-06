import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate);

global.jQuery = require('jquery');
export const $ = global.jQuery;
window.$ = $;

require('bootstrap/dist/js/bootstrap');

axios.defaults.baseURL = 'http://localhost:9090';

export const baseImageURL = 'http://localhost:9090/uploads/';

export const eventBus = new Vue();

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
