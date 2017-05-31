<template>
  <a href="#" class="fb-sign-btn btn btn-default btn-medium btn-block" @click="handleSignUp">Sign up with Facebook</a>
</template>

<script>
  export default {
    methods: {
      handleSignUp() {
        window.open('api/auth/facebook', 'signUp', "width=600, height=800");
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../style/constants';

  .fb-sign-btn {
    border-radius: 0;
  }
</style>

