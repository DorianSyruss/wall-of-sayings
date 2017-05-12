<template>
  <div class="lala">
    <button @click="toggle">Toggle</button>
    <login v-if="login"></login>
    <register v-else></register>
  </div>
</template>


<script>
  import Login from './components/Login.vue';
  import Register from './components/Register.vue';

  export default {
    data() {
        return {
            login: true
        }
    },
    methods: {
        toggle() {
            this.login = !this.login;
        }
    },
    components: {
      Login,
      Register
    }
  }
</script>
