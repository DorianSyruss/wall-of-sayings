<template>
  <div class="container">
    <form @submit.prevent>
      <div class="form-group">
        <label for="register-email">Email address</label>
        <input type="email" class="form-control" id="register-email" placeholder="Email">
      </div>
      <div class="form-group">
        <label for="register-password">Password</label>
        <input type="password" class="form-control" id="register-password" placeholder="Password">
      </div>
      <button type="submit" class="btn btn-default">Register</button>
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
    }
  };
</script>

