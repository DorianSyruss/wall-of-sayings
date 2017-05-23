<template>
  <div class="users">
    <div class="title">
      <div class="panel panel-default">
        <div class="panel-body">
          See public "Wall of Sayings" from other users below ...
        </div>
      </div>
    </div>
    <div class="input-group-sm">
      <input type="text" class="form-control" placeholder="Search Users">
    </div>
    <div class="profiles table">
      <table class="table user-list">
        <thead>
        <tr>
          <th><span>User</span></th>
          <th><span>Role</span></th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="user in users">
            <td>
              <img class="img-circle"
               :src="user.image"
               alt="User Pic">
              <a class="user-link">{{ user.name }}</a>
            </td>
            <td>
              {{ user.role }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</div>
</template>

<script>
  export default {
    data() {
      return {
        users: [{
          name: 'Mali Ante',
          image: 'assets/profile/profile.png',
          role: 'User'
        }, {
          name: 'Mali Ante',
          image: 'assets/profile/profile.png',
          role: 'User'
        }, {
          name: 'Mali Ante',
          image: 'assets/profile/profile.png',
          role: 'User'
        }, {
          name: 'Mali Ante',
          image: 'assets/profile/profile.png',
          role: 'User'
        }, {
          name: 'Mali Ante',
          image: 'assets/profile/profile.png',
          role: 'User'
        }]
      };
    }
  };
</script>

<style lang="scss" scoped>
  .users {
    margin: 15px;
    width: 310px;
    height: 500px;

    .profiles {
      td {
        vertical-align: middle;
      }
      img {
        width: 40px;
      }
    }
  }
</style>
