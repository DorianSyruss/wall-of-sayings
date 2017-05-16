<template>
    <div class="login-form">
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email address</label>
          <input name="email"  type="email" class="form-control" placeholder="Email" v-model="username">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input name="password" type="password" class="form-control"placeholder="Password" v-model="password">
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
      }
    }
  };
</script>

<style lang="scss">
  .login-form {
    padding: 10px 15px 12px 15px;
    margin: 0 0 10px 0;
  }
</style>
