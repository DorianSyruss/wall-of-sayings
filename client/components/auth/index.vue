<template>
  <div class="auth-form">
    <div class="container-fluid">
      <div class="auth-menu row">
        <a href="#" class="log-button btn btn-primary col-sm-6" @click="isSelected = true" :class="{ disabled: isSelected }">Login</a>
        <a href="#" class="reg-button btn btn-primary col-sm-6" @click="isSelected = false" :class="{ disabled: !isSelected }">Register</a>
      </div>
    </div>
    <login @login="onLogin" v-if="isSelected"></login>
    <register v-else></register>
    <facebook></facebook>
  </div>
</template>

<script>
  import Login from './Login.vue';
  import Register from './Register.vue';
  import Facebook from './Facebook.vue';

  export default {
    data() {
      return {
        isSelected: true
      };
    },
    methods: {
      onLogin(user) {
        this.$emit('login', user);
      }
    },
    components: {
      Login,
      Register,
      Facebook
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../style/constants';

  .auth-form {
    margin-top: 15px;
    margin-bottom: 20px;
    @include box-shadow($shadow-color-light);

    .auth-menu {
      background: $theme-color-dark;
      a {
        border-radius: 0;
      }
    }
  }
</style>
