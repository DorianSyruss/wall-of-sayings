<template>
  <div class="auth-form col-xs-12">
    <div class="auth-menu">
        <a href="#" class="log-button btn btn-primary" @click="isSelected = true" :class="{ disabled: isSelected }">Login</a>
        <a href="#" class="reg-button btn btn-primary" @click="isSelected = false" :class="{ disabled: !isSelected }">Register</a>
    </div>
    <login v-if="isSelected"></login>
    <register v-else></register>
    <a href="#" class="btn btn-default btn-lg btn-block">Login With Facebook</a>
    <a href="#" class="btn btn-default btn-lg btn-block">Register With Facebook</a>
  </div>
</template>

<script>
  import Login from './components/Login.vue';
  import Register from './components/Register.vue';

  export default {
    data() {
        return {
          isSelected: true
        };
    },
    components: {
      Login,
      Register
    }
  }
</script>

<style lang="scss">
  .auth-form {
    max-width: 400px;
    margin-top: 15px;
    margin-bottom: 15px;

    .auth-menu{
      background: #2C3E50;
    }

    .log-button {
      width:49%;
    }
    .reg-button {
      width: 50%;
    }
  }
</style>
