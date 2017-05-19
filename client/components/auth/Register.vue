<template>
  <div class="register-form">
    <form @submit.prevent="handleRegister">
      <div class="form-group" :class="{ 'control': true }">
        <label>Name</label>
        <input v-validate="'required'"
           type="text"
           name="firstName"
           data-vv-as="Name"
           class="form-control input-sm"
           placeholder="Name"
           v-model="name">
        <span v-show="errors.has('firstName')" class="label err-label">{{ errors.first('firstName') }}</span>
      </div>
      <div class="form-group">
        <label>Surname</label>
        <input v-validate="'required'"
           name="surname"
           data-vv-as="Surname"
           type="text"
           class="form-control input-sm"
           placeholder="Surname"
           v-model="surname">
        <span v-show="errors.has('surname')" class="label err-label">{{ errors.first('surname') }}</span>
      </div>
      <div class="form-group">
        <label>Email address</label>
        <input v-validate="'required|email'"
           name="email"
           data-vv-as="Email"
           type="email"
           class="form-control input-sm"
           placeholder="Email"
           v-model="email">
        <span v-show="errors.has('email')" class="label err-label">{{ errors.first('email') }}</span>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-validate="'required'"
           name="password"
           data-vv-as="Password"
           type="password"
           class="form-control input-sm"
           placeholder="Password"
           v-model="password">
        <span v-show="errors.has('password')" class="label err-label">{{ errors.first('password') }}</span>
      </div>
      <div class="form-group">
        <label>Repeat Password</label>
        <input v-validate="'required|confirmed:password'"
           name="repeat-password"
           data-vv-as="Repeat password"
           type="password"
           class="form-control input-sm"
           placeholder="Repeat password"
           v-model="repeatPassword">
        <span v-show="errors.has('repeat-password')" class="label err-label">{{ errors.first('repeat-password') }}</span>
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
      <span v-if="errMsg" class="error label label-warning">{{ errMsg }}</span>
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
        gender: '',
        errMsg: ''
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
              this.errMsg = 'User with this email already exists!';
              console.log('Error creating user');
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
  .error {
    margin-bottom: 10px;
    display: block;
    padding: 20px;
  }
</style>

