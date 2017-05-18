<template>
  <div class="register-form">
    <form @submit.prevent="handleRegister">
      <div class="form-group" :class="{ 'control': true }" v-validate="'required'">
        <label>Name</label>
        <input v-validate="'required'"
           type="text"
           name="firstName"
           class="form-control reg-name"
           placeholder="Name"
           v-model="name">
        <span v-show="errors.has('firstName')">{{ errors.first('firstName') }}</span>
      </div>
      <div class="form-group">
        <label>Surname</label>
        <input v-validate="'required'"
           name="surname" type="text"
           class="form-control reg-surname"
           placeholder="Surname"
           v-model="surname">
        <span v-show="errors.has('surname')">{{ errors.first('surname') }}</span>
      </div>
      <div class="form-group">
        <label>Email address</label>
        <input v-validate="'required|email'"
           name="email"
           type="email"
           class="form-control reg-email"
           placeholder="Email"
           v-model="email">
        <span v-show="errors.has('email')">{{ errors.first('email') }}</span>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-validate="'required'"
           name="password"
           type="password"
           class="form-control reg-password"
           placeholder="Password"
           v-model="password">
        <span v-show="errors.has('password')">{{ errors.first('password') }}</span>
      </div>
      <div class="form-group">
        <label>Repeat Password</label>
        <input v-validate="'required'"
               name="repeat-password"
               type="password"
               class="form-control reg-repeat-pass"
               placeholder="Repeat password"
               v-model="repeatPassword">
        <span v-show="errors.has('repeat-password')">{{ errors.first('repeat-password') }}</span>
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
        this.$validator.validateAll().then(() => {
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
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .register-form {
    padding: 10px 15px 12px 15px;
    margin: 0 0 10px 0;
  }
</style>

