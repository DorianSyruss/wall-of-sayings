<template>
    <div class="login-form">
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input v-validate="'required|email'"
                 name="email"
                 type="email"
                 class="form-control reg-email"
                 placeholder="Email"
                 v-model="username">
          <span v-show="errors.has('email')">{{ errors.first('email') }}</span>
        </div>
        <div class="form-group">
          <input v-validate="'required'"
                 name="password"
                 type="password"
                 class="form-control reg-password"
                 placeholder="Password"
                 v-model="password">
          <span v-show="errors.has('password')">{{ errors.first('password') }}</span>
        </div>
        <button type="submit" class="btn btn-default">Login</button>
      </form>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        user: {}
      };
    },
    methods: {
      handleLogin() {
        this.$validator.validateAll().then(() => {
          const user = {
            username: this.username,
            password: this.password
          };
          this.$http.post('/api/auth/login', user)
            .then(({ body: user }) => {
              this.user = user;
              console.log(user);
            }, (response) => {
              console.log(response);
          });
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .login-form {
    padding: 10px 15px 12px 15px;
    margin: 0 0 10px 0;
  }
</style>
