<template>
  <div class="page-wrapper">
    <navbar></navbar>
    <auth-form></auth-form>
  </div>
</template>

<script>
  import AuthForm from './components/auth/index.vue'
  import Navbar from './components/navbar/Navbar.vue'

  export default {
    components: {
      Navbar,
      AuthForm
    }
  }
</script>

<style lang="scss">

</style>
