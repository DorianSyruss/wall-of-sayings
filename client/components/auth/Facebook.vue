<template>
    <a href="#" class="btn btn-default btn-lg btn-block" @click="handleSignUp">Sign up with Facebook</a>
</template>

<script>
  export default {
    methods: {
      handleSignUp() {
        this.$http.get('api/auth/facebook')
          .then(() => { console.log('success')}, () => console.log('failed'));
      }
    }
  }
</script>

