'use strict';
import Vue from 'vue';
import App from './App.vue';
import VueResource from 'vue-resource';
import VeeValidate from 'vee-validate';

Vue.use(VueResource);
Vue.use(VeeValidate);

new Vue({
  el: '#app',
  render: h => h(App)
});
