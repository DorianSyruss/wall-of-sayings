<template>
  <div class="row">
    <div class="categories col-sm-12">
      <div class="col-sm-4" v-for="categorie in categories">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">{{ categorie.title }}</h3>
          </div>
          <div class="panel-body">
            {{ categorie.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        categories: [{
          title: 'Inspirational',
          description: 'Discover things that inspire you'
        }, {
          title: 'Life',
          description: 'Discover things that inspire you'
        }, {
          title: 'Science',
          description: 'Discover things that inspire you'
        }, {
          title: 'Love',
          description: 'Discover things that inspire you'
        }, {
          title: 'Wise',
          description: 'Discover things that inspire you'
        }]
      };
    }
  };
</script>

<style lang="scss" scoped>
  .categories {
    margin-top: 40px;
  }

  .panel {
    border-radius: 0;
  }
</style>
