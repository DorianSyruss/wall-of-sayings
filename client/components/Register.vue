<template>
  <div class="register-form">
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Name</label>
          <input type="text" class="form-control reg-name" placeholder="Name" v-model="name">
        </div>
        <div class="form-group">
          <label>Surname</label>
          <input type="text" class="form-control reg-surname" placeholder="Surname" v-model="surname">
        </div>
        <div class="form-group">
          <label>Email address</label>
          <input type="email" class="form-control reg-email" placeholder="Email" v-model="email">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" class="form-control reg-password" placeholder="Password" v-model="password">
        </div>
        <div class="form-group">
          <label>Repeat Password</label>
          <input type="password" class="form-control reg-repeat-pass" placeholder="Password" v-model="repeatPassword">
        </div>
        <div class="gender">
          <label>
            <input type="radio" name="gender" id="male" value="male" v-model="gender">
            Male
          </label>
          <label>
            <input type="radio" name="gender" id="female" value="female" v-model="gender">
            Female
          </label>
        </div>
        <button type="submit" class="btn btn-default">Register</button>
      </form>
    </div>
</template>


<script>
  export default {
    data() {
      return {
        name: '',
        surname: '',
        email: '',
        password: '',
        repeatPassword: '',
        gender: ''
      };
    },
    methods: {
      handleRegister() {
        let newUser = {
          name: this.name,
          surname: this.surname,
          email: this.email,
          password: this.password,
          gender: this.gender
        };
        this.$http.post('api/register', newUser)
          .then(() => {
            console.log('User Created');
          }, response => {
            console.log('error creating user');
          });
      }
    }
  };
</script>

<style lang="scss">
  .register-form {
    padding: 10px 15px 12px 15px;
    margin: 0 0 10px 0;
  }
</style>

