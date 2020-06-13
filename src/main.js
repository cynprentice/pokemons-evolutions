import Vue from 'vue'
import App from './App.vue'
import router from './router';
import VueLocalStorage from 'vue-ls';



Vue.config.productionTip = false


let options = {
  namespace: 'poke__'
};

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

Vue.use(VueLocalStorage, options);