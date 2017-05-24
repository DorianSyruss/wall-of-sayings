<template>
  <div class="page-wrapper">
    <navbar></navbar>
    <div class="content-left">
      <auth-form></auth-form>
      <users></users>
    </div>
    <div class="content-center col-sm-8">
      <div class="top-content col-sm-12">
        <div class="content-title">
          <h2>{{ title }}</h2>
        </div>
        <div class="description">
          <p>{{ description }}</p>
        </div>
      </div>
      <categories></categories>
      <quotes></quotes>
    </div>
  </div>
</template>

<script>
  import AuthForm from 'components/auth/index.vue';
  import Navbar from 'components/navbar/Navbar.vue';
  import Users from 'components/Users.vue';
  import Quotes from 'components/Quotes.vue';
  import Categories from 'components/Categories.vue';

  export default {
    data() {
      return {
        title: 'Quotes and Sayings',
        description: 'This is some description'
      };
    },
    components: {
      Navbar,
      AuthForm,
      Users,
      Categories,
      Quotes
    }
  };
</script>

<style lang="scss" scoped>
  .content-left {
    float: left;
  }
</style>
