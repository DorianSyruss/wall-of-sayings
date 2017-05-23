<template>
  <div class="auth-form">
    <div class="auth-menu">
      <a href="#" class="log-button btn btn-primary" @click="isSelected = true" :class="{ disabled: isSelected }">Login</a>
      <a href="#" class="reg-button btn btn-primary" @click="isSelected = false" :class="{ disabled: !isSelected }">Register</a>
    </div>
    <login v-if="isSelected"></login>
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
    margin: 15px;
    max-width: 310px;
    @include box-shadow($shadow-color-light);

    .auth-menu {
      background: $theme-color-dark;
    }

    .log-button {
      width:49%;
    }
    .reg-button {
      width: 50%;
    }
  }
</style>
