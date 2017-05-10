new Vue({
  el: '#app',
  data: {
    username: '',
    password: ''
  },
  methods: {
    handleLogin() {
      console.log('poziv');
      const user = {
        username: this.username,
        password: this.password
      };
      this.$http.post('/api/auth/login', user)
        .then((response) => {
          console.log(response.body);
        }, (response) => {
          console.log(response);
        });
    }
  }
});


