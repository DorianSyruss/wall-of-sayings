<template>
  <div class="page-wrapper">
    <navbar></navbar>
    <auth-form></auth-form>
    <users></users>
  </div>
</template>

<script>
  import AuthForm from 'components/auth/index.vue';
  import Navbar from 'components/navbar/Navbar.vue';
  import Users from 'components/Users.vue';

  export default {
    components: {
      Navbar,
      AuthForm,
      Users
    }
  };
</script>

<style lang="scss" scoped>

</style>
