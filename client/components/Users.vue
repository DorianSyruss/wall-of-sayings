<template>
  <div class="users">
    <div class="title">
      <div class="panel panel-default">
        <div class="panel-body">
          See public "Wall of Sayings" from other users below ...
        </div>
      </div>
    </div>
    <div class="search-users input-group-sm">
      <input type="text" class="form-control" placeholder="Search users ...">
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
              <a href="#" class="user-link">{{ user.name }}</a>
            </td>
            <td class="align-center">
              {{ user.role }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</div>
</template>

<script>
  const users = [{
      name: 'Mali Ante',
      image:'assets/profile/profile.png',
      role: 'Admin'
    }, {
      name: 'Mali Ante',
      image:'assets/profile/profile.png',
      role: 'User'
    }, {
      name: 'Mali Ivan',
      image:'assets/profile/profile.png',
      role: 'Moderator'
    }, {
      name: 'Mali Ante',
      image:'assets/profile/profile.png',
      role: 'User'
    }, {
      name: 'Mali Ante',
      image:'assets/profile/profile.png',
      role: 'User'
    }];

  export default {
    data() {
      return {
        users
      };
    }
  };
</script>

<style lang="scss" scoped>
  @import '../style/constants';

  .users {
    height: 500px;

    .search-users {
      margin-bottom: 10px;
    }

    .profiles {
      thead {
        background: #18BC9C;

        th {
          text-align: center;
        }
      }

      tbody {
        border-bottom: 1px solid $theme-color-light;

        td {
          vertical-align: middle;
        }

        img {
          width: 40px;
        }
      }
    }
  }
</style>
