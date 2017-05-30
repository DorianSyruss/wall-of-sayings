<template>
  <div>
    <navbar></navbar>
    <div class="container-fluid">
      <div class="row">
        <div class="content-left col-md-2 col-lg-3">
          <auth-form @login="onLogin" v-if="!user.id"></auth-form>
          <collections v-else></collections>
          <users></users>
        </div>
        <div class="content-center col-sm-6 col-md-6 col-lg-6">
          <quotes v-if="activeCategory" @clearCategory="clearCategory" :category="activeCategory"></quotes>
          <categories v-else @categorySelected="toggleCategory"></categories>
        </div>
        <div class="content-right col-lg-3">
          <proposed></proposed>
          <latest></latest>
          <popular></popular>
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
  import Popular from 'components/Quotes/Popular.vue';
  import Collections from 'components/Collections.vue';

  export default {
    data() {
      return {
        activeCategory: '',
        user: {}
      };
    },
    methods: {
      toggleCategory(category) {
        this.activeCategory = category;
      },
      clearCategory() {
        this.activeCategory = '';
      },
      onLogin(user) {
        console.log('login');
        this.user = user;
      }
    },
    components: {
      Navbar,
      AuthForm,
      Users,
      Categories,
      Collections,
      Quotes,
      Proposed,
      Latest,
      Popular
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
