import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import Vuelidate from 'vuelidate'
import AOS from 'aos';
import 'aos/dist/aos.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.css'

AOS.init();
Vue.use(Vuelidate);

global.jQuery = require('jquery');
export const $ = global.jQuery;
window.$ = $;

require('bootstrap/dist/js/bootstrap');

axios.defaults.baseURL = 'https://localhost:44352';

export const baseImageURL = 'https://localhost:44352/api/files/';

export const eventBus = new Vue();

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

export const ShowToast = (type, title, msg = '') => {
    let color;
    if (type === 1)
        color = 'rgba(11,183,108,0.8)';
    else if (type === 2)
        color = 'rgba(229,57,53,0.81)';
    else
        color = 'rgba(0,179,223,0.8)';
    iziToast.show({
        theme: 'dark',
        backgroundColor: color,
        pauseOnHover: true,
        progressBar: true,
        position: "bottomRight",
        title: title,
        message: msg,
        timeout: 2000,
        balloon: true
    })
};