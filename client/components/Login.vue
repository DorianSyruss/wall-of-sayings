<template>
  <div class="container">
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="login-email">Email address</label>
        <input name="email"  type="email" class="form-control" id="login-email" placeholder="Email" v-model="username">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input name="password" type="password" class="form-control" id="password-input" placeholder="Password" v-model="password">
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
