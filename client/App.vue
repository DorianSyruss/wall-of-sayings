<template>
  <div>
    <navbar></navbar>
    <div class="container-fluid">
      <div class="row">
        <div class="content-left col-md-2 col-lg-3">
          <auth-form></auth-form>
          <users></users>
        </div>
        <div class="content-center col-sm-6 col-md-6 col-lg-6">
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
        <div class="content-right col-lg-3">
          <proposed></proposed>
          <latest></latest>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AuthForm from 'components/auth/index.vue';
  import Navbar from 'components/navbar/Navbar.vue';
  import Users from 'components/Users.vue';
  import Quotes from 'components/Quotes/Quotes.vue';
  import Categories from 'components/Categories.vue';
  import Proposed from 'components/Quotes/Proposed.vue';
  import Latest from 'components/Quotes/Latest.vue';

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
      Quotes,
      Proposed,
      Latest
    }
  };
</script>

<style lang="scss" scoped>
  .container-fluid {
    max-width: 1366px;
  }

  .content-left {
    float: left;
  }

  .content-center {
    .content-title h2 {
      margin-top: 15px;
    }
  }
  .content-right {
    float: right;
  }
</style>
